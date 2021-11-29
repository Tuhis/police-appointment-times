import { FreeSlotsResponse } from "./interfaces/IFreeSlotsResponse";
import IStation from "./interfaces/IStation";

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
    return new Promise<{ data: number }>((resolve) =>
        setTimeout(() => resolve({ data: amount }), 500)
    );
}

export function fetchStations(): Promise<{[id: string]: IStation}> {
    return fetch("https://police-api.kube.ioio.fi/stations")
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function fetchFreeSlots(): Promise<FreeSlotsResponse> {
    return fetch("https://police-api.kube.ioio.fi/freetimes")
        .then(res => res.json())
        .catch(err => console.error(err));
}
