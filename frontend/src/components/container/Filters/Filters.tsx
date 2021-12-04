import { Switch } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectGroupByRegions, toggleGroupByRegions } from "../../../features/filters/filtersSlice";
import BaseCard from "../../presentational/BaseCard/BaseCard";
import Row50 from "../../presentational/Row50/Row50";
import styles from "./Filters.module.css";

export function Filters() {
    const groupByRegions = useAppSelector(selectGroupByRegions);
    const dispatch = useAppDispatch();

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
                            checked={groupByRegions}
                            onChange={() => dispatch(toggleGroupByRegions())} />
                    </Row50>
                    </BaseCard>
                    <BaseCard
                        autoHeight
                        autoWidth={false}
                        showTitle={false}
                        title={"Suodattimet"} />
                </div>
            </BaseCard>
        </div>
    )
}
