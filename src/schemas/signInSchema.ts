import {z} from 'zod'
export const singnInSchema=z.object({
    identifier:z.string(),
    password:z.string(),
})