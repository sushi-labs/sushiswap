import { AuctionType, VestingType } from '@sushiswap/bonds-sdk'
import { type Address, isAddress } from 'viem'
import { z } from 'zod'

// Stolen from @sushiswap/rockset-client on the flair branch, TODO: move to a better place?
const chainId = () => z.coerce.number().int()

const address = () =>
  z.string().transform((address) => {
    if (!isAddress(address)) throw new Error('Invalid address')

    return address.toLowerCase() as Address
  })

const bigint = () => z.string().transform((val) => BigInt(val))

const token = () =>
  z.object({
    address: address(),
    name: z.string(),
    symbol: z.string(),
    decimals: bigint(),
  })

const auctionTypes: Record<string, AuctionType> = {
  dynamic: AuctionType['Dynamic'],
  static: AuctionType['Static'],
  'oracle-static': AuctionType['Static'],
}

const vestingTypes: Record<string, VestingType> = {
  'fixed-term': VestingType['Fixed-Term'],
}

// Graph object validation
export const BondSchema = z.object({
  id: z.string(),
  chainId: chainId(),
  type: z.string().transform((val) => {
    if (!Object.keys(auctionTypes).includes(val))
      throw new Error('Invalid auction type')

    return auctionTypes[val]!
  }),
  auctioneer: address(),
  teller: address(),
  marketId: bigint(),
  owner: address(),
  capacity: bigint(),
  capacityInQuote: z.boolean(),
  hasClosed: z.boolean(),
  start: bigint().nullable(),
  conclusion: bigint().nullable(),
  vesting: bigint(),
  vestingType: z.string().transform((val) => {
    if (!Object.keys(vestingTypes).includes(val))
      throw new Error('Invalid vesting type')

    return vestingTypes[val]!
  }),
  quoteToken: token(),
  totalBondedAmount: z.coerce.number(),
  payoutToken: token(),
  totalPayoutAmount: z.coerce.number(),
  minPrice: bigint().nullable(),
  scale: bigint().nullable(),
  averageBondPrice: z.coerce.number(),
  bondsIssued: bigint(),
})

export const BondPositionSchema = z.object({
  owner: address(),
  chainId: chainId(),

  balance: bigint(),

  bondToken: z.object({
    id: z.string(),
    expiry: bigint(),
    type: z.string(),
    teller: z.string(),
    underlying: token(),
  }),
})
