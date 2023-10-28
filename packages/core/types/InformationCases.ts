import { z } from "zod";

export const DataSchema = z.array(
    z.object({
        cases: z.number(),
        date: z.string(),
    })
);

export const CaseSchema = z.object({
    data: DataSchema,
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export const StateCaseSchema = z.object({
    data:
        z.record(z.enum(["BB", "BE", "BW", "BY", "HB", "HE", "HH", "MV", "NI", "NW", "RP", "SH", "SL", "SN", "ST", "TH"]), z.object({
            id: z.number(),
            name: z.string(),
            history: DataSchema
        })),
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export type TypeCases = z.infer<typeof CaseSchema>
export type TypeStateCases = z.infer<typeof StateCaseSchema>