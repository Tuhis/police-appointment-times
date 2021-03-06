import _ from "lodash";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectGroupByRegions } from "../../../features/filters/filtersSlice";
import { chooseDate, chooseRegion, chooseStation, selectFreeSlotsFiltered, selectStationsFiltered } from "../../../features/police/policeSlice";
import BaseCard from "../../presentational/BaseCard/BaseCard";
import ButtonWithData from "../../presentational/ButtonWithData/ButtonWithData";
import styles from "./CardGrid.module.css";

export function CardGrid() {
    const freeSlots = useAppSelector(selectFreeSlotsFiltered);
    const stations = useAppSelector(selectStationsFiltered);
    const groupByRegions = useAppSelector(selectGroupByRegions);
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

                                {!groupByRegions && _.map(_.orderBy(date.stations, station => stations[station].name.fi), station => {
                                    return (
                                        <ButtonWithData
                                            isButton
                                            key={station}
                                            label={stations[station].name.fi}
                                            data={_.get(date.slotsPerStation, station, 0).toString()}
                                            onClick={() => {
                                                dispatch(chooseStation(station));
                                                dispatch(chooseDate(date.dateString));
                                            }} />
                                    );
                                })}
                                {groupByRegions &&
                                    _.chain(date.stations)
                                    .groupBy(station => stations[station].region)
                                    .map((stations, region) => {
                                        return (
                                            <ButtonWithData
                                                isButton
                                                key={region}
                                                label={region}
                                                data={_.chain(stations).map(stationId => _.get(date.slotsPerStation, stationId, 0)).sum().value().toString()}
                                                onClick={() => {
                                                    dispatch(chooseRegion(region));
                                                    dispatch(chooseDate(date.dateString));
                                                }} />
                                        );
                                    })
                                    .value()
                                }
                            </BaseCard>
                        )
                    }).reverse()}
                </div>
                :
                <div>
                    Palvelu toistaiseksi poissa k??yt??st??, pahoittelemme tilannetta.<br />
                    <br />
                    Poliisi ep??ilee palveluntarjoajaa tietoj??rjestelm??n h??irinn??st??.<br />
                    Ks. <a href="https://www.finlex.fi/fi/laki/ajantasa/1889/18890039001#L38">Rikoslaki luku 38</a> pyk??l?? 7<br />
                    <br />
                    T??m?? palvelu toimii hakemalla palvelupisteiden ajanvaraustiedot Poliisin tietoj??rjestelm??st?? 15
                    minuutin v??lein v??limuistiin, josta ne edelleen tarjoillaan poliisi.ioio.fi sivuston
                    k??vij??ille.
                    <br />
                    Ilmeisesti 15 minuutin v??lein ajanvaraustietojen hakeminen Poliisin rajapinnasta aiheuttaa
                    suorituskykyongelmia valtakunnalliseen ajanvarausj??rjestelm????n.<br />
                    <br />
                    Palvelun l??hdekoodi: <a href="https://github.com/Tuhis/police-appointment-times">https://github.com/Tuhis/police-appointment-times</a><br />
                    Lis??tiedot: juho.kuusisto@elisanet.fi
                </div>
            }
        </React.Fragment>
    )
}
