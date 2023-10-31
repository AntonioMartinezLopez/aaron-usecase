import { z } from "zod";

export const DataSchema = z.array(
    z.object({
        deaths: z.number(),
        date: z.string(),
    })
);

export const DeathSchema = z.object({
    data: DataSchema,
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export const StateDeathDataSchema = z.record(z.enum(["BB", "BE", "BW", "BY", "HB", "HE", "HH", "MV", "NI", "NW", "RP", "SH", "SL", "SN", "ST", "TH"]), z.object({
    id: z.number(),
    name: z.string(),
    history: DataSchema
}));

export const StateDeathSchema = z.object({
    data: StateDeathDataSchema,
    meta: z.object({
        source: z.string(),
        contact: z.string(),
        info: z.string(),
        lastUpdate: z.string(),
        lastCheckedForUpdate: z.string(),
    }),
});

export type TypeDeaths = z.infer<typeof DeathSchema>
export type TypeStateDeaths = z.infer<typeof StateDeathSchema>
export type TypeStateDeathsData = z.infer<typeof StateDeathDataSchema>