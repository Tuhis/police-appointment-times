import { FreeSlotsResponse } from "./interfaces/IFreeSlotsResponse";
import IStation from "./interfaces/IStation";

const BASE_PATH = "https://poliisi.ioio.fi/api";

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
    return new Promise<{ data: number }>((resolve) =>
        setTimeout(() => resolve({ data: amount }), 500)
    );
}

export function fetchStations(): Promise<{[id: string]: IStation}> {
    return fetch(`${BASE_PATH}/stations`)
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function fetchFreeSlots(): Promise<FreeSlotsResponse> {
    return fetch(`${BASE_PATH}/freetimes`)
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function fetchFreeSlotsForStation(stationId: string, dateString: string): Promise<string[]> {
    return fetch(`${BASE_PATH}/${stationId}/${dateString}/freeslots`)
        .then(res => res.json())
        .catch(err => console.error(err));
}
