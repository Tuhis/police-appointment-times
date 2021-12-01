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

function App() {
    const chosenStation = useAppSelector(selectChosenStationId);
    const narrowViewport = !window.matchMedia(`(min-width: ${NARROW_DISPLAY_WIDTH}px)`).matches;

    return (
        <div className="App">
            <PoliceDataLoader />
            <ChosenStationFreeSlots />

            <div className={"content"}>
                <Topbar>
                    <Breadcrumbs path={["Vapaat ajat passihakemuksen tekoon"]} />
                </Topbar>
                <CardGrid />
            </div>
        </div>
    );
}

export default App;
