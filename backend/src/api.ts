import * as Hapi from "@hapi/hapi";
import PoliceTimeslotsApi from "./api/PoliceTimeslotsApi.js";

const plugin: Hapi.Plugin<any> = {
    name: "api",
    version: "1.0.0",

    register: async (server: Hapi.Server, options): Promise<void> => {
        PoliceTimeslotsApi.getInstance().init(); // not waiting to for return on purpose

        server.route({
            method: "GET",
            path:"/health",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().getId();
            }
        });

        server.route({
            method: "GET",
            path:"/ready",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().isReady();
            }
        });

        server.route({
            method: "GET",
            path:"/freetimes",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().getFreeSlotsPerDay();
            }
        });

        server.route({
            method: "GET",
            path:"/freetimesage",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().getFreeSlotsPerDayAge();
            }
        });

        server.route({
            method: "GET",
            path:"/stations",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().getStations();
            }
        });

        server.route({
            method: "GET",
            path:"/stationsage",
            handler: (request, h) => {
                return PoliceTimeslotsApi.getInstance().getStationsAge();
            }
        });

        return Promise.resolve();
    }
}

export const Api = plugin;
