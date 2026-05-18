import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'
import { HYPERUNIT_BASE_URL } from './hyper-unit-base-url'

export const useHUEstimateFees = () => {
  return useQuery({
    queryKey: ['useHUEstimateFees'],
    queryFn: async () => {
      const res = await fetch(`${HYPERUNIT_BASE_URL}/estimate-fees`)
      const data = await res.json()

      const parsed = bridgeFeesSchema.safeParse(data)
      if (!parsed.success) {
        throw new Error('Unable to fetch fee estimates')
      }
      return parsed.data
    },
    refetchInterval: ms('5m'),
  })
}
// type TokenType =
//   | 'avalanche'
//   | 'base'
//   | 'base-erc20'
//   | 'bitcoin'
//   | 'ethereum'
//   | 'ethereum-erc20'
//   | 'monad'
//   | 'plasma'
//   | 'solana'
//   | 'spl'
//   | 'zcash'

export type BridgeFees = z.infer<typeof bridgeFeesSchema>
export type BridgeFeeChain = keyof BridgeFees

const etaSchema = z.string().regex(/^\d+m$/)

const unknownChainValueSchema = z.union([z.number(), etaSchema])
//used for if more chains are added, we don't want the entire fee fetching to break
const unknownChainSchema = z.record(z.string(), unknownChainValueSchema)

const avalancheSchema = z
  .object({
    'avalanche-base-fee': z.number(),
    'avalanche-deposit-fee-in-units': z.number(),
    'avalanche-depositEta': etaSchema,
    'avalanche-depositFee': z.number(),
    'avalanche-eth-deposit-gas': z.number(),
    'avalanche-eth-withdrawal-gas': z.number(),
    'avalanche-priority-fee': z.number(),
    'avalanche-withdrawal-fee-in-units': z.number(),
    'avalanche-withdrawalEta': etaSchema,
    'avalanche-withdrawalFee': z.number(),
  })
  .loose()

const baseSchema = z
  .object({
    'base-base-fee': z.number(),
    'base-deposit-fee-in-units': z.number(),
    'base-depositEta': etaSchema,
    'base-depositFee': z.number(),
    'base-erc20-deposit-eta': etaSchema,
    'base-erc20-deposit-fee': z.number(),
    'base-erc20-deposit-fee-in-units': z.number(),
    'base-erc20-deposit-gas': z.number(),
    'base-erc20-withdrawal-eta': etaSchema,
    'base-erc20-withdrawal-fee': z.number(),
    'base-erc20-withdrawal-fee-in-units': z.number(),
    'base-erc20-withdrawal-gas': z.number(),
    'base-eth-deposit-gas': z.number(),
    'base-eth-withdrawal-gas': z.number(),
    'base-priority-fee': z.number(),
    'base-withdrawal-fee-in-units': z.number(),
    'base-withdrawalEta': etaSchema,
    'base-withdrawalFee': z.number(),
  })
  .loose()

const baseErc20Schema = z
  .object({
    'erc20-deposit-eta': etaSchema,
    'erc20-deposit-fee': z.number(),
    'erc20-deposit-fee-in-units': z.number(),
    'erc20-deposit-gas': z.number(),
    'erc20-withdrawal-eta': etaSchema,
    'erc20-withdrawal-fee': z.number(),
    'erc20-withdrawal-fee-in-units': z.number(),
    'erc20-withdrawal-gas': z.number(),
  })
  .loose()

const bitcoinSchema = z
  .object({
    'bitcoin-deposit-fee-in-units': z.number(),
    'bitcoin-deposit-fee-rate-sats-per-vb': z.number(),
    'bitcoin-deposit-size-v-bytes': z.number(),
    'bitcoin-depositEta': etaSchema,
    'bitcoin-depositFee': z.number(),
    'bitcoin-withdrawal-fee-in-units': z.number(),
    'bitcoin-withdrawal-fee-rate-sats-per-vb': z.number(),
    'bitcoin-withdrawal-size-v-bytes': z.number(),
    'bitcoin-withdrawalEta': etaSchema,
    'bitcoin-withdrawalFee': z.number(),
  })
  .loose()

const ethereumSchema = z
  .object({
    'ethereum-base-fee': z.number(),
    'ethereum-deposit-fee-in-units': z.number(),
    'ethereum-depositEta': etaSchema,
    'ethereum-depositFee': z.number(),
    'ethereum-erc20-deposit-eta': etaSchema,
    'ethereum-erc20-deposit-fee': z.number(),
    'ethereum-erc20-deposit-fee-in-units': z.number(),
    'ethereum-erc20-deposit-gas': z.number(),
    'ethereum-erc20-withdrawal-eta': etaSchema,
    'ethereum-erc20-withdrawal-fee': z.number(),
    'ethereum-erc20-withdrawal-fee-in-units': z.number(),
    'ethereum-erc20-withdrawal-gas': z.number(),
    'ethereum-eth-deposit-gas': z.number(),
    'ethereum-eth-withdrawal-gas': z.number(),
    'ethereum-priority-fee': z.number(),
    'ethereum-withdrawal-fee-in-units': z.number(),
    'ethereum-withdrawalEta': etaSchema,
    'ethereum-withdrawalFee': z.number(),
  })
  .loose()

const ethereumErc20Schema = z
  .object({
    'erc20-deposit-eta': etaSchema,
    'erc20-deposit-fee': z.number(),
    'erc20-deposit-fee-in-units': z.number(),
    'erc20-deposit-gas': z.number(),
    'erc20-withdrawal-eta': etaSchema,
    'erc20-withdrawal-fee': z.number(),
    'erc20-withdrawal-fee-in-units': z.number(),
    'erc20-withdrawal-gas': z.number(),
  })
  .loose()

const monadSchema = z
  .object({
    'monad-base-fee': z.number(),
    'monad-deposit-fee-in-units': z.number(),
    'monad-depositEta': etaSchema,
    'monad-depositFee': z.number(),
    'monad-eth-deposit-gas': z.number(),
    'monad-eth-withdrawal-gas': z.number(),
    'monad-priority-fee': z.number(),
    'monad-withdrawal-fee-in-units': z.number(),
    'monad-withdrawalEta': etaSchema,
    'monad-withdrawalFee': z.number(),
  })
  .loose()

const plasmaSchema = z
  .object({
    'plasma-base-fee': z.number(),
    'plasma-deposit-fee-in-units': z.number(),
    'plasma-depositEta': etaSchema,
    'plasma-depositFee': z.number(),
    'plasma-eth-deposit-gas': z.number(),
    'plasma-eth-withdrawal-gas': z.number(),
    'plasma-priority-fee': z.number(),
    'plasma-withdrawal-fee-in-units': z.number(),
    'plasma-withdrawalEta': etaSchema,
    'plasma-withdrawalFee': z.number(),
  })
  .loose()

const solanaSchema = z
  .object({
    'solana-deposit-fee-in-units': z.number(),
    'solana-depositEta': etaSchema,
    'solana-depositFee': z.number(),
    'solana-withdrawal-fee-in-units': z.number(),
    'solana-withdrawalEta': etaSchema,
    'solana-withdrawalFee': z.number(),
  })
  .loose()

const splSchema = z
  .object({
    'spl-deposit-fee-in-units': z.number(),
    'spl-depositEta': etaSchema,
    'spl-depositFee': z.number(),
    'spl-withdrawal-fee-in-units': z.number(),
    'spl-withdrawalEta': etaSchema,
    'spl-withdrawalFee': z.number(),
  })
  .loose()

const zcashSchema = z
  .object({
    'zcash-deposit-fee-in-units': z.number(),
    'zcash-depositEta': etaSchema,
    'zcash-depositFee': z.number(),
    'zcash-withdrawal-fee-in-units': z.number(),
    'zcash-withdrawalEta': etaSchema,
    'zcash-withdrawalFee': z.number(),
  })
  .loose()

export const bridgeFeesSchema = z
  .object({
    avalanche: avalancheSchema,
    base: baseSchema,
    'base-erc20': baseErc20Schema,
    bitcoin: bitcoinSchema,
    ethereum: ethereumSchema,
    'ethereum-erc20': ethereumErc20Schema,
    monad: monadSchema,
    plasma: plasmaSchema,
    solana: solanaSchema,
    spl: splSchema,
    zcash: zcashSchema,
  })
  .catchall(unknownChainSchema)
