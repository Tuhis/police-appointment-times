import _ from "lodash";

export const USE_DEVELOPMENT_DATA = _.defaultTo(process.env.USE_DEVELOPMENT_DATA, "false") === "true";
export const SECONDS_BETWEEN_DATA_UPDATES = _.isNaN(parseInt(process.env.SECONDS_BETWEEN_DATA_UPDATES)) ? 1800 : parseInt(process.env.SECONDS_BETWEEN_DATA_UPDATES);
export const POSTCODE_DATA_SOURCE = "WEB";
export const POSTCODE_DATA_FILE = "";
export const DAYS_TO_FETCH = parseInt(_.defaultTo(process.env.DAYS_TO_FETCH, "41"));
