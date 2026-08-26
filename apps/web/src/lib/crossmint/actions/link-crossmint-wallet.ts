'use server'

import { z } from 'zod'
import { getCrossmintTarget } from '../crossmint-config'
import {
  getCrossmintServerEnvironment,
  requestCrossmint,
} from '../request-crossmint'
import type { CrossmintLinkedWallet, LinkCrossmintWalletInput } from '../types'
import {
  isValidCrossmintWalletAddress,
  linkCrossmintWalletInputSchema,
} from '../validation'

const linkWalletResponseSchema = z.object({
  ownership: z.object({
    verificationChallenge: z.string().min(1).optional(),
    verified: z.boolean(),
  }),
})

export async function linkCrossmintWallet(
  input: LinkCrossmintWalletInput,
): Promise<CrossmintLinkedWallet> {
  const parsedInput = linkCrossmintWalletInputSchema.parse(input)
  const { proof, receiptEmail, token, walletAddress } = parsedInput
  const target = getCrossmintTarget(token, getCrossmintServerEnvironment())

  if (!target.requiresWalletLink) {
    throw new Error('This Crossmint target does not require wallet linking')
  }

  if (!isValidCrossmintWalletAddress(token, walletAddress)) {
    throw new Error(`Invalid ${target.network} recipient wallet address`)
  }

  const userLocator = encodeURIComponent(`email:${receiptEmail}`)
  const address = encodeURIComponent(walletAddress)
  const response = await requestCrossmint(
    `/2025-06-09/users/${userLocator}/linked-wallets/${address}`,
    'PUT',
    {
      chain: target.linkChain,
      ...(proof ? { proof } : {}),
    },
  )
  const parsedResponse = linkWalletResponseSchema.parse(response)

  return {
    verificationChallenge: parsedResponse.ownership.verificationChallenge,
    verified: parsedResponse.ownership.verified,
  }
}
