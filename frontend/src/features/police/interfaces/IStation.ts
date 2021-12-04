export type EnrichedStation = {
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
    region: string;
};
