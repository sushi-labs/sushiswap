import * as yup from 'yup'

import { createVestingSchema } from '../CreateForm'

export const createMultipleVestingSchema = yup.object({
  vestings: yup.array().of(createVestingSchema),
})
