import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';
import { PoliceDataLoader } from './features/police/PoliceDataLoader';
import { CardGrid } from './components/container/CardGrid/CardGrid';

function App() {
  return (
    <div className="App">
        <PoliceDataLoader />
        <CardGrid />
    </div>
  );
}

export default App;
