import { isAddress as isSolanaAddress } from '@solana/addresses'
import { CROSSMINT_SUPPORTED_FIAT_CURRENCIES } from 'src/config'
import { EvmChainId } from 'sushi/evm'
import {
  StellarChainId,
  isStellarAccountAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import { SvmChainId } from 'sushi/svm'
import { isAddress as isEvmAddress } from 'viem'
import { z } from 'zod'
import type { SerializedCrossmintToken } from './crossmint-config'

const AMOUNT_PATTERN = /^(?:0\.\d{1,2}|[1-9]\d{0,4}(?:\.\d{1,2})?)$/

export const serializedCrossmintTokenSchema = z
  .object({
    address: z.string().trim().min(1).max(128),
    chainId: z.union([
      z.literal(EvmChainId.BASE),
      z.literal(SvmChainId.SOLANA),
      z.literal(StellarChainId.STELLAR),
    ]),
    symbol: z.string().trim().min(1).max(32),
  })
  .superRefine((token, context) => {
    const validAddress =
      token.chainId === EvmChainId.BASE
        ? isEvmAddress(token.address)
        : token.chainId === StellarChainId.STELLAR
          ? isStellarContractAddress(token.address)
          : isSolanaAddress(token.address)

    if (!validAddress) {
      context.addIssue({
        code: 'custom',
        message: 'Token address does not match its network',
        path: ['address'],
      })
    }
  })

export const createCrossmintOrderInputSchema = z.object({
  amountUsd: z
    .string()
    .trim()
    .regex(AMOUNT_PATTERN, 'Enter a valid USD amount with up to two decimals'),
  receiptEmail: z.string().trim().email().max(320),
  paymentCurrency: z.enum(CROSSMINT_SUPPORTED_FIAT_CURRENCIES).default('usd'),
  token: serializedCrossmintTokenSchema,
  walletAddress: z.string().trim().min(1).max(128),
})

export function isValidCrossmintReceiptEmail(value: string): boolean {
  return z.string().trim().email().max(320).safeParse(value).success
}

export function isValidCrossmintWalletAddress(
  token: SerializedCrossmintToken,
  walletAddress: string,
): boolean {
  return token.chainId === EvmChainId.BASE
    ? isEvmAddress(walletAddress)
    : token.chainId === StellarChainId.STELLAR
      ? isStellarAccountAddress(walletAddress)
      : isSolanaAddress(walletAddress)
}
