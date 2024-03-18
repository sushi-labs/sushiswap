import z from 'zod'

export const querySchema = z.object({
  stateId: z.optional(z.coerce.number()),
})
