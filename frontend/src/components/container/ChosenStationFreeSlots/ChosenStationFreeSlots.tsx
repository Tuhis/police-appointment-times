import _ from "lodash";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { closeStation, selectChosenDate, selectChosenStationFreeSlots, selectChosenStationId, selectChosenStation, updateChosenStationFreeSlotsAsync, chooseStation } from "../../../features/police/policeSlice";
import styles from "./ChosenStationFreeSlots.module.css";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import ButtonWithData from "../../presentational/ButtonWithData/ButtonWithData";

export function ChosenStationFreeSlots() {
    const chosenStationId = useAppSelector(selectChosenStationId);
    const chosenStation = useAppSelector(selectChosenStation);
    const chosenDate = useAppSelector(selectChosenDate);
    const freeSlots = useAppSelector(selectChosenStationFreeSlots);
    const dispatch = useAppDispatch();
    const isStationSelected = !_.isEmpty(chosenDate) && !_.isNull(chosenStationId);
    const theme = useTheme();

    const handleClose = () => {
        dispatch(closeStation());
    }

    useEffect(() => {
        if (!_.isEmpty(chosenDate) && !_.isNull(chosenStationId))
            dispatch(updateChosenStationFreeSlotsAsync({stationId: chosenStationId, dateString: chosenDate}));
    }, [chosenDate, chosenStationId]);

    return (
        <React.Fragment>
            {!_.isUndefined(chosenStation) &&
                <Dialog
                    open={isStationSelected}
                    onClose={handleClose}
                    fullWidth
                    maxWidth={'xs'}
                >
                    <DialogTitle>
                        {chosenStation.name.fi}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {_.map(_.sortBy(freeSlots, a => new Date(a)), slot => {
                                const timeOnly = slot.substr(slot.indexOf('T')+1);
                                return (
                                    <ButtonWithData
                                        isButton={false}
                                        hideData
                                        centerize
                                        key={slot}
                                        label={timeOnly}
                                        data={""}
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
