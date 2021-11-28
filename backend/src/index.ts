import * as Hapi from "@hapi/hapi";
import { Api } from "./api.js";

const server = new Hapi.Server({
    host: "0.0.0.0",
    port: 3000
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

console.log(process.env.USE_DEVELOPMENT_DATA);

start();

