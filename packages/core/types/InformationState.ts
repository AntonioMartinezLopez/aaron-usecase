export const states = ["BB", "BE", "BW", "BY", "HB", "HE", "HH", "MV", "NI", "NW", "RP", "SH", "SL", "SN", "ST", "TH"];

import { z } from "zod";

export const InformationStateSchema = z.object({
    data:
        z.record(z.enum(["BB", "BE", "BW", "BY", "HB", "HE", "HH", "MV", "NI", "NW", "RP", "SH", "SL", "SN", "ST", "TH"]), z.object({
            id: z.number(),
            name: z.string(),
            population: z.number(),
            cases: z.number(),
            deaths: z.number(),
            casesPerWeek: z.number(),
            deathsPerWeek: z.number(),
            recovered: z.number(),
            abbreviation: z.string(),
            weekIncidence: z.number(),
            casesPer100k: z.number(),
            delta: z.object({
                cases: z.number(),
                deaths: z.number(),
                recovered: z.number(),
            }),
        })),
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export type TypeInformationState = z.infer<typeof InformationStateSchema>
