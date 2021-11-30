import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { PoliceDataLoader } from './features/police/PoliceDataLoader';
import { CardGrid } from './components/container/CardGrid/CardGrid';
import Topbar from './components/presentational/Topbar/Topbar';
import Breadcrumbs from './components/presentational/Breadcrumbs/Breadcrumbs';

function App() {
    return (
        <div className="App">
            <PoliceDataLoader />

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
