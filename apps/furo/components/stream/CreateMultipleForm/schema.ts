import * as yup from 'yup'

import { createStreamSchema } from '../CreateForm'

export const createMultipleStreamSchema = yup.object({
  streams: yup.array().of(createStreamSchema),
})
