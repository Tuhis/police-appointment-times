import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Switch, TextField, Theme, useTheme } from "@mui/material";
import _ from "lodash";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectGroupByRegions, selectVisibleRegions, setVisibleRegions, toggleGroupByRegions } from "../../../features/filters/filtersSlice";
import { selectRegions } from "../../../features/police/policeSlice";
import BaseCard from "../../presentational/BaseCard/BaseCard";
import Row50 from "../../presentational/Row50/Row50";
import styles from "./Filters.module.css";

export function Filters() {
    const isGroupByRegions = useAppSelector(selectGroupByRegions);
    const regions = useAppSelector(selectRegions);
    const visibleRegions = useAppSelector(selectVisibleRegions);
    const shownSelectedRegions = regions.length === visibleRegions.length ? [] : visibleRegions;
    const dispatch = useAppDispatch();

    const handleRegionChange = (e: React.SyntheticEvent, value: Array<string>, reason: string): void => {
        if (reason === "selectOption" || reason === "removeOption" || reason === "clear") {
            dispatch(setVisibleRegions(value));
        }
    };

    return (
        <div className={styles["filters-container"]}>
            <BaseCard
                autoHeight
                title={"Suodattimet"}>

                <div className={styles["filters-container"]}>
                    <BaseCard
                        autoHeight
                        autoWidth={false}
                        showTitle={false}
                        padSidesOnWidescreen={false}
                        title={"Suodattimet"}>
                        <Row50>
                            {"Näytä maakunnittain"}
                            <Switch
                                checked={isGroupByRegions}
                                onChange={() => dispatch(toggleGroupByRegions())} />
                        </Row50>

                    </BaseCard>
                    <BaseCard
                        autoHeight
                        autoWidth={true}
                        showTitle={false}
                        title={"Suodattimet"}>

                        <Autocomplete
                            multiple
                            filterSelectedOptions
                            clearOnBlur
                            blurOnSelect
                            autoComplete
                            size="medium"
                            options={regions}
                            value={shownSelectedRegions}
                            onChange={handleRegionChange}
                            noOptionsText={"Kaikki maakunnat valittu"}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder=" Lisää maakunta..."
                                    label="Maakunnat"
                                    variant="standard"
                                />
                            )}
                        />
                    </BaseCard>
                </div>
            </BaseCard>
        </div>
    )
}
