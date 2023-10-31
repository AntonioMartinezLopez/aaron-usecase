import { API } from "aws-amplify";
import { TypeCases, TypeStateCases } from "../../../core/types/InformationCases";
import { TypeDeaths, TypeStateDeaths } from "../../../core/types/InformationDeaths";
import { TypeInformationGermany } from "../../../core/types/InformationGermany";
import { TypeInformationState } from "../../../core/types/InformationState";

export function fetchGermanyOverviewData(): Promise<TypeInformationGermany> {
    return API.get("covid-api", "/api/germany", {});
}

export function fetchStateOverviewData(state: string): Promise<TypeInformationState> {
    return API.get("covid-api", `/api/states/${state}`, {});
}

export function fetchStateCaseData(state: string, days: number): Promise<TypeStateCases> {
    return days === 0 ? API.get("covid-api", `/api/states/${state}/cases`, {}) : API.get("covid-api", `/api/states/${state}/cases/${days}`, {});
}

export function fetchStateDeathData(state: string, days: number): Promise<TypeStateDeaths> {
    return days === 0 ? API.get("covid-api", `/api/states/${state}/deaths`, {}) : API.get("covid-api", `/api/states/${state}/deaths/${days}`, {});
}

export function fetchGermanyCaseData(days: number = 100): Promise<TypeCases> {
    return days === 0 ? API.get("covid-api", `/api/germany/cases`, {}) : API.get("covid-api", `/api/germany/cases/${days}`, {});
}

export function fetchGermanyDeathData(days: number = 100): Promise<TypeDeaths> {
    return days === 0 ? API.get("covid-api", `/api/germany/deaths`, {}) : API.get("covid-api", `/api/germany/deaths/${days}`, {});
}
