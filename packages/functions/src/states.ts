import handler from "@aaron-usecase/core/handler"
import fetchData from "@aaron-usecase/core/fetchData"
import { states, TypeInformationState, InformationStateSchema } from '@aaron-usecase/types/InformationState'
import { ApiError } from "@aaron-usecase/core/apiError";
import { StateCaseSchema, TypeStateCases } from "@aaron-usecase/types/InformationCases";
import { TypeStateDeaths, StateDeathSchema } from '@aaron-usecase/types/InformationDeaths'

export const main = handler(async (event) => {

    // if state name is missing or is invalid return 400
    if (!event.pathParameters?.state || !states.includes(event.pathParameters?.state)) {
        throw new ApiError("Missing or unknown state path parameter", 400);
    }

    const state = event.pathParameters?.state;

    // Fetch current information for whle germany (Fetching Errors are being catched by handler)
    const result = await fetchData<TypeInformationState>({ method: 'GET', url: `https://api.corona-zahlen.org/states/${state}`, responseType: "json" });

    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    InformationStateSchema.parse(result);

    return JSON.stringify({
        ...result
    });
});


export const cases = handler(async (event) => {

    // if state name is missing or is invalid return 400
    if (!event.pathParameters?.state || !states.includes(event.pathParameters?.state)) {
        throw new ApiError("Missing or unknown state path parameter", 400);
    }

    const state = event.pathParameters?.state;
    const days = event.pathParameters?.days
    let result = {} as TypeStateCases;

    // fetch complete time series
    if (!days) {
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeStateCases>({ method: 'GET', url: `https://api.corona-zahlen.org/states/${state}/history/cases`, responseType: "json" });
    } else {
        // only fetch for given days
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeStateCases>({ method: 'GET', url: `https://api.corona-zahlen.org/states/${state}/history/cases/${days}`, responseType: "json" });
    }
    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    StateCaseSchema.parse(result);

    return JSON.stringify({
        ...result
    });

});


export const deaths = handler(async (event) => {

    // if state name is missing or is invalid return 400
    if (!event.pathParameters?.state || !states.includes(event.pathParameters?.state)) {
        throw new ApiError("Missing or unknown state path parameter", 400);
    }

    const state = event.pathParameters?.state;
    const days = event.pathParameters?.days
    let result = {} as TypeStateDeaths;

    // fetch complete time series
    if (!days) {
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeStateDeaths>({ method: 'GET', url: `https://api.corona-zahlen.org/states/${state}/history/deaths`, responseType: "json" });
    } else {
        // only fetch for given days
        // Fetch current information for whle germany (Fetching Errors are being catched by handler)
        result = await fetchData<TypeStateDeaths>({ method: 'GET', url: `https://api.corona-zahlen.org/states/${state}/history/deaths/${days}`, responseType: "json" });
    }
    // Validate result and check whether changes have been made on the covid api
    // If changes have been made, an error is thrown that is being catched by handler
    StateDeathSchema.parse(result);

    return JSON.stringify({
        ...result
    });

});
