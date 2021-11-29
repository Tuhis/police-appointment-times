export interface IFreeSlotsResponseElement {
    date: Date;
    dateString: string;
    freeSlots: number;
    stations: string[]
}

export type FreeSlotsResponse = IFreeSlotsResponseElement[];
