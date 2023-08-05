import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { PoliceDataLoader } from './features/police/PoliceDataLoader';
import { CardGrid } from './components/container/CardGrid/CardGrid';
import Topbar from './components/presentational/Topbar/Topbar';
import Breadcrumbs from './components/presentational/Breadcrumbs/Breadcrumbs';
import { NARROW_DISPLAY_WIDTH, ROUTES } from "./constants/generic";
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectChosenStationId } from './features/police/policeSlice';
import { Sidebar } from './components/presentational/Sidebar/Sidebar';
import { ChosenStationFreeSlots } from './components/container/ChosenStationFreeSlots/ChosenStationFreeSlots';
import { Filters } from './components/container/Filters/Filters';
import { Info } from './components/container/Info/Info';
import { ChosenRegionStations } from './components/container/ChosenRegionStations/ChosenRegionStations';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
import { push } from "redux-first-history";
import BigLinkList from './components/presentational/BigLinkList/BigLinkList';
import _ from 'lodash';
import { DataAge } from './components/container/DataAge/DataAge';
import { Spacer } from './components/presentational/Spacer/Spacer';

function App() {
    const dispatch = useAppDispatch();
    const breadcrumbPath = _.chain(useLocation().pathname)
        .split("/")
        .compact()
        .map(e => _.startCase(
            _.defaultTo(
                _.find(
                    ROUTES, route => route.PATH === `/${e}`
                ), {TEXT_FI: "Tuntematon polku"}
            ).TEXT_FI))
        .value()
    // Prepend the common "starting path" to the path
    breadcrumbPath.unshift("Vapaat ajat passihakemuksen tekoon");
    const chosenStation = useAppSelector(selectChosenStationId);
    const narrowViewport = !window.matchMedia(`(min-width: ${NARROW_DISPLAY_WIDTH}px)`).matches;

    const sidebarLinks = [
        {
            text: ROUTES.DEFAULT.TEXT_FI,
            onClick: () => dispatch(push(ROUTES.DEFAULT.PATH))
        },
        // {
        //     text: ROUTES.MAP.TEXT_FI,
        //     onClick: () => dispatch(push(ROUTES.MAP.PATH))
        // },
        {
            text: ROUTES.INFO.TEXT_FI,
            onClick: () => dispatch(push(ROUTES.INFO.PATH))
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <PoliceDataLoader />

                {/* Modals */}
                <ChosenStationFreeSlots />
                <ChosenRegionStations />

                <Sidebar>
                    <BigLinkList
                        links={sidebarLinks}
                        rotateTextsOnNarrowList
                    />
                    <Spacer
                        height="75px"
                    />
                    <DataAge />
                </Sidebar>

                <div className={"content"}>
                    <Topbar>
                        <Breadcrumbs path={breadcrumbPath} />
                    </Topbar>
                    <Routes>
                        <Route path={ROUTES.DEFAULT.PATH} element={
                            <React.Fragment>
                                <Filters />
                                <CardGrid />
                            </React.Fragment>
                        } />
                        <Route path={ROUTES.MAP.PATH} element={
                            <React.Fragment />
                        } />
                        <Route path={ROUTES.INFO.PATH} element={
                            <Info />
                        } />
                        <Route path="/*" element={ <Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
