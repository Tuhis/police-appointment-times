import _ from "lodash";
import fetch from "node-fetch";
import { POSTCODE_DATA_FILE, POSTCODE_DATA_SOURCE } from "../config.js";

const POSTI_DATAFILE_URL = "https://www.posti.fi/webpcode/";

enum DataSource {
    Web = "WEB",
    File = "FILE",
}

type PostcodeRegionMap = {
    [id: string]: string;
}

type IRegion = {
    region: string
}

// TODO: Proper error handling for fetch calls. Or _any_ error handling...

// Documentation for Posti files https://www.posti.fi/mzj3zpe8qb7p/1eKbwM2WAEY5AuGi5TrSZ7/33cfc2c66d2649af885b36e3935556a1/posti-postinumeropalvelut-palvelukuvaus-ja-kayttoehdot-20150101.pdf

class PostcodeApi {
    private static instance: PostcodeApi;
    private dataSource = POSTCODE_DATA_SOURCE;
    private sourceDataURL: string = "";
    private sourceData: string;
    private postcodes: PostcodeRegionMap = {};

    private constructor() {
    }

    public static getInstance(): PostcodeApi {
        if (!PostcodeApi.instance) {
            PostcodeApi.instance = new PostcodeApi();
        }

        return PostcodeApi.instance;
    }

    public async init(): Promise<void> {
        await this.updateData();
    }

    public getRegionForPostcode(postcode: string): IRegion {
        return {
            region: _.get(this.postcodes, postcode, "Tuntematon maakunta")
        };
    }

    public getPostcodeRegionMap(): PostcodeRegionMap {
        return this.postcodes;
    }

    private async updateData(): Promise<void> {
        await this.resolveSourceDataURL();
        await this.fetchSourceData();

        console.log(`PostcodeApi::updateData - Data updated. Indexed ${_.keys(this.postcodes).length} postcodes.`);
        console.log(_.uniq(_.map(this.postcodes)));
    }

    private async resolveSourceDataURL(): Promise<void> {
        if (this.dataSource === DataSource.Web) {
            // Get directory html page
            const datafileDirHtmlRes = await fetch(POSTI_DATAFILE_URL);
            const datafileDirHtmlText = await datafileDirHtmlRes.text();

            // Parse html and find latest (=first) PCF_* file
            const pcfFileUrl = datafileDirHtmlText.match(/"(https:\/\/www\.posti\.fi\/webpcode\/unzip\/PCF\_.*)"/)[1];

            console.log(`PostcodeApi::resolveSourceDataURL - URL: ${pcfFileUrl}`);

            this.sourceDataURL = pcfFileUrl;

        } else if (this.dataSource === DataSource.File) {
            this.sourceDataURL = POSTCODE_DATA_FILE;
        }
    }

    private async fetchSourceData(): Promise<void> {
        if (this.dataSource === DataSource.Web) {
            await fetch(this.sourceDataURL)
                .then(res => {
                    if (!res.ok) throw new Error("HTTP error " + res.status);

                    return res.arrayBuffer();
                })
                .then(buf => {
                    const decoder = new TextDecoder('latin1');
                    const text = decoder.decode(buf);

                    return text;
                })
                .then(text => {
                    // Text is 220 chars (+newline) per row with known positions for fields
                    // Doc: https://www.posti.fi/mzj3zpe8qb7p/1eKbwM2WAEY5AuGi5TrSZ7/33cfc2c66d2649af885b36e3935556a1/posti-postinumeropalvelut-palvelukuvaus-ja-kayttoehdot-20150101.pdf
                    for (let i = 0; i < text.length; i+=221) {
                        const postcodeIndex = 14 - 1;
                        const postcodeLength = 5;
                        const regionIndex = 117 - 1;
                        const regionLength = 30;

                        const postcode = text.substr(i + postcodeIndex, postcodeLength);
                        const region = text.substr(i + regionIndex, regionLength);

                        this.postcodes[postcode] = region.trim();
                    }
                });
        } else if (this.dataSource === DataSource.File) {
            // TODO
        }
    }

}

export default PostcodeApi;
