import _ from "lodash";
import { POLICE_API_BASE_URL } from "../../util/config";
import { FreeSlotsResponse, IFreeSlotsResponseElement } from "./interfaces/IFreeSlotsResponse";
import { EnrichedStation } from "./interfaces/IStation";

const BASE_PATH = POLICE_API_BASE_URL;

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
    return new Promise<{ data: number }>((resolve) =>
        setTimeout(() => resolve({ data: amount }), 500)
    );
}

export function fetchStations(): Promise<{[id: string]: EnrichedStation}> {
    return fetch(`${BASE_PATH}/stations`)
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function fetchFreeSlots(): Promise<FreeSlotsResponse> {
    return fetch(`${BASE_PATH}/freetimes`)
        .then(res => res.json())
        .then(res => _.map(res, i => {
            if (!_.has(i, "date")) {
                throw new Error("Missing date property on API response!");
            }

            i.date = new Date(i.date);

            return i as IFreeSlotsResponseElement;
        }))
        .catch(err => {
            console.error(err)

            return [];
        });
}

export function fetchFreeSlotsForStation(stationId: string, dateString: string): Promise<string[]> {
    return fetch(`${BASE_PATH}/${stationId}/${dateString}/freeslots`)
        .then(res => res.json())
        .catch(err => console.error(err));
}

export function fetchFreeSlotsAge(): Promise<number> {
    return fetch(`${BASE_PATH}/freetimesage`)
        .then(res => res.json())
        .catch(err => {
            console.error(err);

            return Number.NaN;
        });
}
