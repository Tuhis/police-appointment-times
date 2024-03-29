import fetch from "node-fetch";
import _ from "lodash";
import { createRequire } from "module";
import { DAYS_TO_FETCH, SECONDS_BETWEEN_DATA_UPDATES, USE_DEVELOPMENT_DATA } from "../config.js";
import { hrtime } from "process";
import { DateTime } from "luxon";
import PostcodeApi from "./PostcodeApi.js";

const require = createRequire(import.meta.url);

interface ICookieAndCSRF {
    cookie: string;
    csrfToken: string;
    csrfHeaderName: string;
}

type IStation = {
    id: string;
    crowdiness: string;
    name: {
        fi: string;
        sv: string;
    };
    address: {
        fi: string;
        sv: string;
    };
    postalOffice: {
        fi: string;
        sv: string;
    };
    postalCode: string;
    commissionStyle: string;
    nearestPostalCodes: string[];
    latLng: {
        lat: number;
        lng: number;
    };
    coordinates: number[];
}

type EnrichedStation = {
    region: string
} & IStation

interface IStationMap {
    [id: string]: EnrichedStation;
}

interface IStationTimeslots {
    prereservation: any; // not sure what this is... Seems to be null most of the time.
    siteMargin: string; // a date string, YYYY-MM-DDTHH:mm
    slots: {
        [date: string]: { // a date string, YYYY-MM-DDTHH:mm
            timeSlots: string[];
            closed: boolean;
        }
    }
}

class PoliceTimeslotsApi {
    private static instance: PoliceTimeslotsApi;
    private id: string;
    private dataTimestamp: bigint = hrtime.bigint();
    private dataStartDate: DateTime;
    private dataEndDate: DateTime;
    private stations: IStationMap = {};
    private stationsSlotData: {[id: string]: IStationTimeslots} = {};
    private clientId = 'C' + (1000000000 * Math.random() & 100000).toString(); // As Poliisi defines it. Not really needed.
    private freeSlotsPerDayResponse: {
        date: Date;
        dateString: string;
        freeSlots: number;
        stations: string[];
        slotsPerStation: {[id: string]: number};
    }[] = [];
    private ready: boolean = false;

    private constructor() {
        this.id = (Math.random() + 1).toString(36).substring(7);
        this.updateQueryTime();
    }

    public static getInstance(): PoliceTimeslotsApi {
        if (!PoliceTimeslotsApi.instance) {
            PoliceTimeslotsApi.instance = new PoliceTimeslotsApi();
        }

        return PoliceTimeslotsApi.instance;
    }

    public async init(): Promise<void> {
        console.log(this.id);
        if (this.ready) return;

        console.log("Initializing PoliceTimeslotsApi");
        console.log("Data refresh interval:", SECONDS_BETWEEN_DATA_UPDATES);
        console.log("Using development data:", USE_DEVELOPMENT_DATA);

        await this.updateData();

        this.ready = true;
    }

    public getId(): string {
        return this.id;
    }

    public isReady(): boolean {
        return this.ready;
    }

    public getFreeSlotsPerDay() {
        return this.freeSlotsPerDayResponse;
    }

    public getFreeSlotsPerDayAge(): string {
        return ((process.hrtime.bigint() - this.dataTimestamp)/BigInt(1e9)).toString();
    }

    public getFreeSlots(stationId: string, dateString: string): string[] {
        const timeSlots = _.get(this.stationsSlotData, [stationId, "slots", dateString, "timeSlots"], []);

        return timeSlots;
    }

    public getStations(): IStationMap {
        return this.stations;
    }

    public getStationsAge(): string {
        return this.getFreeSlotsPerDayAge();
    }

    public getStationsSlotData(): {[id: string]: IStationTimeslots} {
        return this.stationsSlotData;
    }

    private async updateData(): Promise<void> {// Parse csrf stuff
        console.log("PoliceTimeslotsApi: Updating data");

        this.updateQueryTime();

        if (USE_DEVELOPMENT_DATA) {
            this.stationsSlotData = require("./development.json");
            this.stations = require("./development-stations.json");

            this.updateFreeSlotsPerDayResponse();

        } else {
            try {
                const cookieAndCSRF = await this.getCookieAndCSRF();

                // Update list of stations
                await this.updateStations(cookieAndCSRF.cookie);

                // Update timeslots data
                await this.updateTimeslotsData(cookieAndCSRF);

            } catch (err) {
                console.log(err);
                console.log("Scheduling retry after half the update interval");


                setTimeout(this.updateData.bind(this), SECONDS_BETWEEN_DATA_UPDATES * (1000 / 2));

                return;
            }

            // Update the actual responses
            this.updateFreeSlotsPerDayResponse();

        }
        this.dataTimestamp = hrtime.bigint();

        // Schedule next data update
        setTimeout(this.updateData.bind(this), SECONDS_BETWEEN_DATA_UPDATES * 1000);
    }

    private updateQueryTime(): void {
        this.dataStartDate = DateTime.now();
        this.dataEndDate = this.dataStartDate.plus({days: DAYS_TO_FETCH}).minus({milliseconds: 1});
    }

    private async getCookieAndCSRF(): Promise<ICookieAndCSRF> {
        const csrfRegexp = /window\._csrf = "([a-zA-Z0-9\-]+)"/;
        const csrfHeaderNameRegexp = /window\._csrf_header =  "([a-zA-Z0-9\-]+)"/;
        let cookie = "pol_init=1; secure; SameSite=None";

        // Get session cookie + csrf token
        const res = await fetch("https://asiointi.poliisi.fi/ajanvaraus-fe/reserve", {
            redirect: "follow",
            follow: 1,
            headers: {
                cookie
            }
        });
        const resText = await res.text();

        cookie = cookie.concat("; ").concat(res.headers.get("set-cookie"));

        const csrfToken = resText.match(csrfRegexp)[1];
        const csrfHeaderName = resText.match(csrfHeaderNameRegexp)[1];

        return {
            cookie,
            csrfToken,
            csrfHeaderName
        };
    }

    private async updateStations(cookie: string): Promise<void> {
        const res = await fetch("https://asiointi.poliisi.fi/ajanvaraus-fe/api/siteStatus/1/AV0499/false", {
            headers: {
                cookie
            }
        });
        const stations = await res.json() as IStation[]; // TODO: Check the result with e.g. Joi

        stations.forEach(station => {
            const postalOfficeName = _.isEmpty(station.postalOffice) ? "NO_POSTAL_OFFICE_NAME" : _.get(station.postalOffice, "fi", "NO_POSTAL_OFFICE_FI_NAME");
            let stationRegion = PostcodeApi.getInstance().getRegionForPostcodeName(postalOfficeName).region;

            // Postal office was not found from the DB => Try with postcode
            const postcode = _.isEmpty(station.postalCode) ? station.nearestPostalCodes[0] : station.postalCode;
            if (stationRegion === "Tuntematon maakunta") {
                stationRegion = PostcodeApi.getInstance().getRegionForPostcode(postcode).region;
            }

            this.stations[station.id] = {
                ...station,
                region: stationRegion
            };
        });
    }

    private async updateTimeslotsData(cookieAndCSRF: ICookieAndCSRF): Promise<void> {
        // Fetch timeslots one station at a time to avoid causing traffic spikes at remote servers.
        // TODO: Handle (or at least report!) errors (4xx and 5xx responses)
        console.time("timeslots")
        for (const [key, station] of Object.entries(this.stations)) {
            console.log(`PoliceTimeslotsApi::updateTimeslotsData - Fetching station ${station.id.toString()} ${station.name.fi}`)
            console.log(JSON.stringify({
                "participantMultiplier": 1,
                "siteId": station.id,
                "startDate": this.dataStartDate.toUTC().toISO(),
                "endDate": this.dataEndDate.toUTC().toISO(),
                "ajanvarausServiceType": {
                    "typeSystemCode": "AV0499",
                    "caseType": "PASSI"
                }
            }))
            const data = await fetch(`https://asiointi.poliisi.fi/ajanvaraus-fe/api/timereservation/${this.clientId}_${station.id.toString()}_${this.dataStartDate.toUTC().toISO().substr(0, 10)}`, {
                headers: {
                    "Cookie": cookieAndCSRF.cookie,
                    [cookieAndCSRF.csrfHeaderName]: cookieAndCSRF.csrfToken,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    "participantMultiplier": 1,
                    "siteId": station.id,
                    "startDate": this.dataStartDate.toUTC().toISO(),
                    "endDate": this.dataEndDate.toUTC().toISO(),
                    "ajanvarausServiceType": {
                        "typeSystemCode": "AV0499",
                        "caseType": "PASSI"
                    }
                })
            }).then(async res => {
                const restext = await res.json()
                console.log(restext)
                console.log(res.url)
                console.log(res.status)
                console.log(res.statusText)
                console.log(res.headers)
                return Promise.resolve(restext)
            }) as IStationTimeslots

            this.stationsSlotData[station.id] = data;
        }
        console.log("PoliceTimeslotsApi::updateTimeslotsData - Done updating data")
        console.log(`Took:`)
        console.timeEnd("timeslots")
    }

    private updateFreeSlotsPerDayResponse(): void {
        const dates: {
            [date: string]: {
                freeSlots: number,
                stations: string[],
                slotsPerStation: {[id: string]: number}
            }
        } = {};

        _.forEach(this.stationsSlotData, (data, stationId) => {
            _.forEach(data.slots, (value, date) => {
                const freeSlots = value.timeSlots.length;

                if (_.isUndefined(dates[date])) dates[date] = { freeSlots: 0, stations: [], slotsPerStation: {}};

                if (freeSlots !== 0) {
                    dates[date].freeSlots = dates[date].freeSlots + freeSlots;
                    dates[date].stations.push(stationId);
                    dates[date].slotsPerStation[stationId] = freeSlots;
                }
            });
        });

        const responseArray = _.map(dates, (value, date) => ({
            date: new Date(date),
            dateString: date,
            ...value
        }))
        .sort((a, b) => b.date.valueOf() - a.date.valueOf());

        this.freeSlotsPerDayResponse = responseArray;
    }
}

export default PoliceTimeslotsApi;
