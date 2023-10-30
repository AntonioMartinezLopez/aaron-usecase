import handler from "@aaron-usecase/core/handler"
import fetchData from "@aaron-usecase/core/fetchData"
import { TypeInformationGermany, InformationGermanySchema } from '@aaron-usecase/types/InformationGermany'
import { TypeCases, CaseSchema } from '@aaron-usecase/types/InformationCases'
import { TypeDeaths, DeathSchema } from '@aaron-usecase/types/InformationDeaths'

export const main = handler(async (_event) => {

    // Fetch current information for whole germany (Fetching Errors are being catched by handler)
    const result = await fetchData<TypeInformationGermany>({ method: 'GET', url: 'https://api.corona-zahlen.org/germany', responseType: "json" });

    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    InformationGermanySchema.parse(result);

    return JSON.stringify({
        ...result
    });
});

export const cases = handler(async (event) => {

    const days = event.pathParameters?.days
    let result = {} as TypeCases;

    // fetch complete time series
    if (!days) {
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeCases>({ method: 'GET', url: 'https://api.corona-zahlen.org/germany/history/cases', responseType: "json" });
    } else {
        // only fetch for given days
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeCases>({ method: 'GET', url: `https://api.corona-zahlen.org/germany/history/cases/${days}`, responseType: "json" });

    }
    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    CaseSchema.parse(result);

    return JSON.stringify({
        ...result
    });
});

export const deaths = handler(async (event) => {

    const days = event.pathParameters?.days
    let result = {} as TypeDeaths;

    // fetch complete time series
    if (!days) {
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeDeaths>({ method: 'GET', url: 'https://api.corona-zahlen.org/germany/history/deaths', responseType: "json" });
    } else {
        // only fetch for given days
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeDeaths>({ method: 'GET', url: `https://api.corona-zahlen.org/germany/history/deaths/${days}`, responseType: "json" });

    }
    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    DeathSchema.parse(result);

    return JSON.stringify({
        ...result
    });
});