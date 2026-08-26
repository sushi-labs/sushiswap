'use server'

import { z } from 'zod'
import { getCrossmintTarget } from '../crossmint-config'
import {
  getCrossmintServerEnvironment,
  requestCrossmint,
} from '../request-crossmint'
import type { CreateCrossmintOrderInput, CrossmintCreatedOrder } from '../types'
import {
  createCrossmintOrderInputSchema,
  isValidCrossmintWalletAddress,
} from '../validation'

const createOrderResponseSchema = z.object({
  clientSecret: z.string().min(1),
  order: z.object({
    orderId: z.string().min(1),
    payment: z
      .object({
        preparation: z
          .object({
            message: z.string().min(1).optional(),
          })
          .optional(),
        status: z.string().optional(),
      })
      .optional(),
  }),
})

export async function createCrossmintOrder(
  input: CreateCrossmintOrderInput,
): Promise<CrossmintCreatedOrder> {
  const parsedInput = createCrossmintOrderInputSchema.parse(input)
  const { amountUsd, receiptEmail, token, walletAddress } = parsedInput
  const target = getCrossmintTarget(token, getCrossmintServerEnvironment())

  if (!isValidCrossmintWalletAddress(token, walletAddress)) {
    throw new Error(`Invalid ${target.network} recipient wallet address`)
  }

  const executionParameters: Record<string, string> = {
    amount: amountUsd,
    mode: 'exact-in',
  }

  if (target.kind === 'memecoin') {
    executionParameters.maxSlippageBps = '500'
  }

  const response = await requestCrossmint('/2022-06-09/orders', 'POST', {
    lineItems: [
      {
        executionParameters,
        tokenLocator: target.tokenLocator,
      },
    ],
    payment: {
      method: 'card',
      receiptEmail,
    },
    recipient: {
      walletAddress,
    },
  })
  const parsedResponse = createOrderResponseSchema.parse(response)
  const { payment } = parsedResponse.order
  const requiresVerification =
    payment?.status === 'requires-recipient-verification'
  const verificationMessage = requiresVerification
    ? payment.preparation?.message
    : undefined

  if (requiresVerification && !verificationMessage) {
    throw new Error('Crossmint did not return a wallet verification challenge')
  }

  return {
    clientSecret: parsedResponse.clientSecret,
    orderId: parsedResponse.order.orderId,
    verificationMessage,
  }
}
