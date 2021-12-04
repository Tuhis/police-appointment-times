import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { PoliceDataLoader } from './features/police/PoliceDataLoader';
import { CardGrid } from './components/container/CardGrid/CardGrid';
import Topbar from './components/presentational/Topbar/Topbar';
import Breadcrumbs from './components/presentational/Breadcrumbs/Breadcrumbs';
import { NARROW_DISPLAY_WIDTH } from "./constants/generic";
import { useAppSelector } from './app/hooks';
import { selectChosenStationId } from './features/police/policeSlice';
import { Sidebar } from './components/presentational/Sidebar/Sidebar';
import { ChosenStationFreeSlots } from './components/container/ChosenStationFreeSlots/ChosenStationFreeSlots';
import { Filters } from './components/container/Filters/Filters';
import { ChosenRegionStations } from './components/container/ChosenRegionStations/ChosenRegionStations';

function App() {
    const chosenStation = useAppSelector(selectChosenStationId);
    const narrowViewport = !window.matchMedia(`(min-width: ${NARROW_DISPLAY_WIDTH}px)`).matches;

    return (
        <div className="App">
            <PoliceDataLoader />
            <ChosenStationFreeSlots />
            <ChosenRegionStations />

            <div className={"content"}>
                <Topbar>
                    <Breadcrumbs path={["Vapaat ajat passihakemuksen tekoon"]} />
                </Topbar>
                <Filters />
                <CardGrid />
            </div>
        </div>
    );
}

export default App;
