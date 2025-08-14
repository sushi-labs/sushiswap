import { useQuery } from '@tanstack/react-query'
import type { IDExtended } from 'src/ui/pool/add-liquidity/add-liquidity-blade'
import { EvmChainId } from 'sushi'
import type { BladeChainId } from 'sushi/config'
import { type Type, tryParseAmount } from 'sushi/currency'
import type { Address, Hex } from 'viem'
import type { z } from 'zod'
import { bladeDepositSchema } from '~evm/api/blade/deposit/route'

const toQueryString = (obj: BladeDepositParams): string => {
  const params = new URLSearchParams()

  // we keep your snake_case keys as-is to match your backend
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    // handle nested objects (e.g. `deposit` record) by JSON-encoding
    if (typeof value === 'object' && !Array.isArray(value)) {
      params.set(key, JSON.stringify(value))
    } else {
      params.set(key, String(value))
    }
  })

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

const formatDeposit = (tokens: Type[], inputs: Record<IDExtended, string>) => {
  //if the input string is empty or "0" skip that input and token
  return tokens.reduce(
    (acc, token) => {
      const input = inputs[token.id]
      const parsedInput = tryParseAmount(input, token)
      if (parsedInput?.greaterThan(0)) {
        acc[token.wrapped.address] = parsedInput.quotient.toString()
      }
      return acc
    },
    {} as Record<Address, string>,
  )
}

type BladeDepositParams = z.infer<typeof bladeDepositSchema>

export const useBladeDepositParams = ({
  sender,
  poolAddress,
  chainId,
  tokens,
  inputs,
}: {
  sender?: Address
  poolAddress?: Address
  chainId: BladeChainId
  tokens: Type[]
  inputs: Record<IDExtended, string>
}) => {
  return useQuery({
    queryKey: [
      'useBladeDepositParams',
      { sender, poolAddress, chainId, tokens, inputs },
    ],
    queryFn: async () => {
      if (
        !sender ||
        !poolAddress ||
        !chainId ||
        !tokens.length ||
        !Object.keys(inputs).length ||
        tokens.length !== Object.keys(inputs).length
      ) {
        return null
      }
      const deposit = formatDeposit(tokens, inputs)

      const validated = bladeDepositSchema.parse({
        sender,
        pool_address: poolAddress,
        days_to_lock: chainId !== EvmChainId.KATANA ? 1 : undefined, //hardcode 1 for now until UI figured out
        lock_time: chainId === EvmChainId.KATANA ? 1 : undefined, //hardcode 1 for now until UI figured out
        // commented out atm b/c return message says: single asset deposit is not available
        // deposits: isSingleAsset ? undefined: deposits,
        deposit: deposit,
        chain_id: chainId,
        // commented out atm b/c return message says: single asset deposit is not available
        // output_pool_tokens:  undefined,
        // commented out atm b/c return message says: single asset deposit is not available
        // single_asset: isSingleAsset,
        // commented out atm b/c return message says: single asset deposit is not available
        // single_token: isSingleAsset ? Object.keys(deposits)[0] : undefined,
        single_asset: false, //hardcode false for now b/c single asset deposit is not available
        single_token: undefined, //hardcode false for now b/c single asset deposit is not available
      })
      const queryString = toQueryString(validated as BladeDepositParams)
      const res = await fetch(`/api/blade/deposit${queryString}`, {
        method: 'GET',
      })

      if (!res.ok) {
        const bodyText = await res.json().catch(() => '')
        throw new Error(
          bodyText?.errorMessage || 'An unexpected error occurred',
        )
      }

      const data = await res.json()

      if (chainId === 747474) {
        return data as BladeParamResponseKatana
      } else {
        return data as BladeParamResponse
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: Boolean(
      sender &&
        poolAddress &&
        chainId &&
        tokens.length &&
        Object.keys(inputs).length &&
        tokens.length === Object.keys(inputs).length,
    ),
  })
}

type BladeParamBase = {
  sender: Address
  pool_tokens: string
  good_until: number
  signature: {
    v: number
    r: Address
    s: Address
  }
  clipper_exchange_address: Address
  deposit_amounts: string[]
}

export type BladeParamResponse = BladeParamBase & {
  n_days: number
}

export type BladeParamResponseKatana = BladeParamBase & {
  extra_data: Hex
  lock_time: number
}

/** Conditional type by chain id */
export type BladeParamResponseFor<C extends BladeChainId> =
  C extends typeof EvmChainId.KATANA
    ? BladeParamResponseKatana
    : BladeParamResponse
