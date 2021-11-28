import fetch from "node-fetch";
import _ from "lodash";
import { createRequire } from "module";
import { SECONDS_BETWEEN_DATA_UPDATES, USE_DEVELOPMENT_DATA } from "../config.js";
import { hrtime } from "process";

const require = createRequire(import.meta.url);

const DAYS_TO_FETCH = 30;

interface ICookieAndCSRF {
    cookie: string;
    csrfToken: string;
    csrfHeaderName: string;
}

interface IStation {
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

interface IStationMap {
    [id: string]: IStation;
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
    private dataStartDate = "2021-11-28T22:00:00.000Z";
    private dataEndDate = "2022-01-02T21:59:59.999Z";
    private stations: IStationMap = {};
    private stationsSlotData: {[id: string]: IStationTimeslots} = {};
    private clientId = 'C' + (1000000000 * Math.random() & 100000).toString(); // As Poliisi defines it. Not really needed.
    private freeSlotsPerDayResponse: {
        date: Date;
        dateString: string;
        freeSlots: number;
        stations: string[]
    }[] = [];
    private ready: boolean = false;

    private constructor() {
        this.id = (Math.random() + 1).toString(36).substring(7);
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

    public getStations(): IStationMap {
        return this.stations;
    }

    public getStationsAge(): string {
        return this.getFreeSlotsPerDayAge();
    }

    private async updateData(): Promise<void> {// Parse csrf stuff
        console.log("PoliceTimeslotsApi: Updating data");

        if (USE_DEVELOPMENT_DATA) {
            this.freeSlotsPerDayResponse = _.map(require("./development.json"), elem => ({
                date: new Date(elem.date),
                dateString: elem.dateString,
                freeSlots: elem.freeSlots,
                stations: elem.stations
            }));

            this.stations = require("./development-stations.json");

        } else {
            const cookieAndCSRF = await this.getCookieAndCSRF();

            // Update list of stations
            await this.updateStations(cookieAndCSRF.cookie);

            // Update timeslots data
            await this.updateTimeslotsData(cookieAndCSRF);

            // Update the actual responses
            this.updateFreeSlotsPerDayResponse();

        }
        this.dataTimestamp = hrtime.bigint();

        // Schedule next data update
        setTimeout(this.updateData.bind(this), SECONDS_BETWEEN_DATA_UPDATES * 1000);
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
            this.stations[station.id] = station;
        });
    }

    private async updateTimeslotsData(cookieAndCSRF: ICookieAndCSRF): Promise<void> {
        const resArr = await Promise.all(_.map(this.stations, async station => ({
            data: await fetch(`https://asiointi.poliisi.fi/ajanvaraus-fe/api/timereservation/${this.clientId}_${station.id.toString}_${this.dataStartDate.substr(0, 10)}`, {
                headers: {
                    "Cookie": cookieAndCSRF.cookie,
                    [cookieAndCSRF.csrfHeaderName]: cookieAndCSRF.csrfToken,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    "participantMultiplier": 1,
                    "siteId": station.id,
                    "startDate": this.dataStartDate,
                    "endDate": this.dataEndDate,
                    "ajanvarausServiceType": {
                        "typeSystemCode": "AV0499",
                        "caseType": "PASSI"
                    }
                })
            }).then(res => res.json()) as IStationTimeslots,
            stationId: station.id
        })));

        _.forEach(resArr, res => this.stationsSlotData[res.stationId] = res.data);
    }

    private updateFreeSlotsPerDayResponse(): void {
        const dates: {
            [date: string]: {
                freeSlots: number,
                stations: string[]
            }
        } = {};

        _.forEach(this.stationsSlotData, (data, stationId) => {
            _.forEach(data.slots, (value, date) => {
                const freeSlots = value.timeSlots.length;

                if (_.isUndefined(dates[date])) dates[date] = { freeSlots: 0, stations: []};

                if (freeSlots !== 0) {
                    dates[date].freeSlots = dates[date].freeSlots + freeSlots;
                    dates[date].stations.push(stationId);
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
