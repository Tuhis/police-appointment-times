export default interface IStationTimeslots {
    prereservation: any; // not sure what this is... Seems to be null most of the time.
    siteMargin: string; // a date string, YYYY-MM-DDTHH:mm
    slots: {
        [date: string]: { // a date string, YYYY-MM-DDTHH:mm
            timeSlots: string[];
            closed: boolean;
        }
    }
}
