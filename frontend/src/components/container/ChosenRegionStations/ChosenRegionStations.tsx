import _ from "lodash";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { closeStation, selectChosenDate, selectChosenStationFreeSlots, selectChosenStationId, selectChosenStation, updateChosenStationFreeSlotsAsync, chooseStation, selectChosenRegion, selectChosenRegionStations, closeRegion, selectFreeTimeslotsOnChosenDayPerStation } from "../../../features/police/policeSlice";
import styles from "./ChosenStationFreeSlots.module.css";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import ButtonWithData from "../../presentational/ButtonWithData/ButtonWithData";

export function ChosenRegionStations() {
    const chosenRegion = useAppSelector(selectChosenRegion);
    const chosenDate = useAppSelector(selectChosenDate);
    const stations = useAppSelector(selectChosenRegionStations);
    const timeslotsPerStation = useAppSelector(selectFreeTimeslotsOnChosenDayPerStation);
    const dispatch = useAppDispatch();
    const isRegionSelected = !_.isEmpty(chosenDate) && !_.isNull(chosenRegion);
    const theme = useTheme();

    const handleClose = () => {
        dispatch(closeRegion());
    }

    return (
        <React.Fragment>
            {!_.isUndefined(chosenRegion) &&
                <Dialog
                    open={isRegionSelected}
                    onClose={handleClose}
                    fullWidth
                    maxWidth={'xs'}
                >
                    <DialogTitle>
                        {chosenRegion}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {_.map(_.sortBy(stations, station => station.name.fi), station => {
                                return (
                                    <ButtonWithData
                                        isButton
                                        centerize
                                        key={station.id}
                                        label={station.name.fi}
                                        data={_.get(timeslotsPerStation, station.id, 0).toString()}
                                        onClick={() => {
                                            dispatch(closeRegion());
                                            dispatch(chooseStation(station.id));
                                        }}
                                    />
                                );
                            })}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
                }

        </React.Fragment>
    );
}
