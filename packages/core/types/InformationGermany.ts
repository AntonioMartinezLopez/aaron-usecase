import { z } from "zod";

// Define the Zod schema
export const InformationGermanySchema = z.object({
    cases: z.number(),
    deaths: z.number(),
    recovered: z.number(),
    weekIncidence: z.number(),
    casesPer100k: z.number(),
    casesPerWeek: z.number(),
    delta: z.object({
        cases: z.number(),
        deaths: z.number(),
        recovered: z.number(),
        weekIncidence: z.number(),
    }),
    r: z.object({
        value: z.number(),
        rValue4Days: z.object({
            value: z.number(),
            date: z.string(),
        }),
        rValue7Days: z.object({
            value: z.number(),
            date: z.string(),
        }),
        lastUpdate: z.string(),
    }),
    hospitalization: z.object({
        cases7Days: z.number(),
        incidence7Days: z.number(),
        date: z.string(),
        lastUpdate: z.string(),
    }),
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export type TypeInformationGermany = z.infer<typeof InformationGermanySchema>

