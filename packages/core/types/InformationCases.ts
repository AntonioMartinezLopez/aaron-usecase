import { z } from "zod";
import { statesEnum } from "./InformationState";

const DataSchema = z.array(
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

export const StateCaseDataSchema = z.record(statesEnum, z.object({
    id: z.number(),
    name: z.string(),
    history: DataSchema
}));

export const StateCaseSchema = z.object({
    data: StateCaseDataSchema,
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
export type TypeStateCasesData = z.infer<typeof StateCaseDataSchema>