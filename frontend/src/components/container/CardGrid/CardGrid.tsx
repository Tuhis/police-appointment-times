import _ from "lodash";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { chooseDate, chooseStation, selectFreeSlots, selectFreeSlotsStatus, selectStations, updateChosenStationFreeSlotsAsync } from "../../../features/police/policeSlice";
import BaseCard from "../../presentational/BaseCard/BaseCard";
import ButtonWithData from "../../presentational/ButtonWithData/ButtonWithData";
import KeyValueList from "../../presentational/KeyValueList/KeyValueList";
import styles from "./CardGrid.module.css";

export function CardGrid() {
    const freeSlots = _.filter(useAppSelector(selectFreeSlots), date => date.freeSlots !== 0);
    const stations = useAppSelector(selectStations);
    const freeSlotsStatus = useAppSelector(selectFreeSlotsStatus);
    const dispatch = useAppDispatch();

    return (
        <React.Fragment>
            {!_.isEmpty(stations) && !_.isEmpty(freeSlots) ?
                <div className={styles["card-container"]}>
                    {_.map(freeSlots, date => {
                        return (
                            <BaseCard
                                key={date.dateString}
                                title={date.dateString}
                                autoHeight={true}
                                autoWidth={true}
                                minHeight={0}
                                showTitle={true}
                                editableTitle={false}
                                onTitleChange={_.noop} >

                                {_.map(_.orderBy(date.stations, station => stations[station].name.fi), station => {
                                    return (
                                        <ButtonWithData
                                            isButton
                                            key={station}
                                            label={stations[station].name.fi}
                                            data={date.slotsPerStation[station].toString()}
                                            onClick={() => {
                                                dispatch(chooseStation(station));
                                                dispatch(chooseDate(date.dateString));
                                            }} />
                                    );
                                })}
                            </BaseCard>
                        )
                    }).reverse()}
                </div>
                :
                <div>No data</div>
            }
        </React.Fragment>
    )
}
