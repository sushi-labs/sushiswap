import type * as z from 'zod'
import type {
  crossChainActionSchema,
  crossChainEstimateSchema,
  crossChainRouteSchema,
  crossChainStepSchema,
  crossChainToolDetailsSchema,
  crossChainTransactionRequestSchema,
} from './schema'

type CrossChainAction = z.infer<typeof crossChainActionSchema>

type CrossChainEstimate = z.infer<typeof crossChainEstimateSchema>

type CrossChainRoute = z.infer<typeof crossChainRouteSchema>

type CrossChainStep = z.infer<typeof crossChainStepSchema>

type CrossChainToolDetails = z.infer<typeof crossChainToolDetailsSchema>

type CrossChainTransactionRequest = z.infer<
  typeof crossChainTransactionRequestSchema
>

type CrossChainRouteOrder = 'CHEAPEST' | 'FASTEST'

export type {
  CrossChainAction,
  CrossChainEstimate,
  CrossChainRoute,
  CrossChainStep,
  CrossChainToolDetails,
  CrossChainTransactionRequest,
  CrossChainRouteOrder,
}
