import { z } from 'zod'
import {
  crossChainActionSchema,
  crossChainRouteSchema,
  crossChainStepSchema,
  crossChainToolDetailsSchema,
} from '../../../swap/cross-chain/schema'

export type CrossChainAction = z.infer<typeof crossChainActionSchema>

export type CrossChainRoute = z.infer<typeof crossChainRouteSchema>

export type CrossChainStep = z.infer<typeof crossChainStepSchema>

export type CrossChainToolDetails = z.infer<typeof crossChainToolDetailsSchema>
