import { z } from 'zod'
import {
  crossChainActionSchema,
  crossChainRouteSchema,
  crossChainStepSchema,
  crossChainToolDetailsSchema,
  crossChainTransactionRequestSchema,
} from './schema'

type CrossChainAction = z.infer<typeof crossChainActionSchema>

type CrossChainRoute = z.infer<typeof crossChainRouteSchema>

type CrossChainStep = z.infer<typeof crossChainStepSchema>

type CrossChainToolDetails = z.infer<typeof crossChainToolDetailsSchema>

type CrossChainTransactionRequest = z.infer<
  typeof crossChainTransactionRequestSchema
>

export type {
  CrossChainAction,
  CrossChainRoute,
  CrossChainStep,
  CrossChainToolDetails,
  CrossChainTransactionRequest,
}
