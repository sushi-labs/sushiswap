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

const crossmintMoneySchema = z.object({
  amount: z.string().min(1),
  currency: z.string().min(1),
})

const createOrderResponseSchema = z.object({
  clientSecret: z.string().min(1),
  order: z.object({
    lineItems: z
      .array(
        z.object({
          quote: z
            .object({
              quantityRange: z
                .object({
                  lowerBound: z.string().min(1),
                  upperBound: z.string().min(1),
                })
                .optional(),
            })
            .optional(),
        }),
      )
      .optional(),
    orderId: z.string().min(1),
    quote: z
      .object({
        expiresAt: z.string().min(1).optional(),
        totalPrice: crossmintMoneySchema.optional(),
      })
      .optional(),
  }),
})

function getCrossmintChain(tokenLocator: string): string {
  const separatorIndex = tokenLocator.indexOf(':')

  if (separatorIndex <= 0) {
    throw new Error('Invalid Crossmint token locator')
  }

  return tokenLocator.slice(0, separatorIndex)
}

async function linkCrossmintOnrampWallet({
  receiptEmail,
  tokenLocator,
  walletAddress,
}: {
  receiptEmail: string
  tokenLocator: string
  walletAddress: string
}): Promise<void> {
  const userLocator = encodeURIComponent(`email:${receiptEmail}`)
  const address = encodeURIComponent(walletAddress)

  await requestCrossmint(
    `/2025-06-09/users/${userLocator}/linked-wallets/${address}`,
    'PUT',
    { chain: getCrossmintChain(tokenLocator) },
  )
}

export async function createCrossmintOrder(
  input: CreateCrossmintOrderInput,
): Promise<CrossmintCreatedOrder> {
  const parsedInput = createCrossmintOrderInputSchema.parse(input)
  const { amountUsd, paymentCurrency, receiptEmail, token, walletAddress } =
    parsedInput
  const target = getCrossmintTarget(token, getCrossmintServerEnvironment())

  if (!isValidCrossmintWalletAddress(token, walletAddress)) {
    throw new Error(`Invalid ${target.network} recipient wallet address`)
  }

  if (target.kind === 'stablecoin') {
    await linkCrossmintOnrampWallet({
      receiptEmail,
      tokenLocator: target.tokenLocator,
      walletAddress,
    })
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
      currency: paymentCurrency,
      method: 'card',
      receiptEmail,
    },
    recipient: {
      walletAddress,
    },
  })
  const parsedResponse = createOrderResponseSchema.parse(response)
  const receiveAmount =
    parsedResponse.order.lineItems?.[0]?.quote?.quantityRange
  const totalPrice = parsedResponse.order.quote?.totalPrice
  const expiresAt = parsedResponse.order.quote?.expiresAt

  return {
    clientSecret: parsedResponse.clientSecret,
    orderId: parsedResponse.order.orderId,
    ...(receiveAmount || totalPrice || expiresAt
      ? { quote: { expiresAt, receiveAmount, totalPrice } }
      : {}),
  }
}
