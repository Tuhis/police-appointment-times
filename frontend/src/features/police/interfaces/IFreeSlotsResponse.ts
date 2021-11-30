export interface IFreeSlotsResponseElement {
    date: Date;
    dateString: string;
    freeSlots: number;
    stations: string[];
    slotsPerStation: {[id: string]: number};
}

export type FreeSlotsResponse = IFreeSlotsResponseElement[];
