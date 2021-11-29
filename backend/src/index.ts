import * as Hapi from "@hapi/hapi";
import { Api } from "./api.js";
import process from "process";

const server = new Hapi.Server({
    host: "0.0.0.0",
    port: 3000,
    routes: {
        cors: true
    }
});

async function start() {
    await server.register([{
        plugin: Api
    }]);

    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {

            return '404 Error! Page Not Found!';
        }
    });

    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log("Server running at:", server.info.uri);
}

process.on('SIGINT', function onSigint() {
    // server.stop();
    process.exit(0);
});

process.on('SIGTERM', function onSigterm() {
    // server.stop();
    process.exit(0);
});

console.log(process.env.USE_DEVELOPMENT_DATA);

start();

