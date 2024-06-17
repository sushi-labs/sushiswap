declare module '@prisma/client' {
  import type {
    Prisma,
    SushiPool as PrismaSushiPool,
    Protocol,
  } from '@prisma/client/index'
  export * from '@prisma/client/index'

  type Address = `0x${string}`
  type ID = `${string}:${Address}`

  export type DecimalToString<T> = {
    [P in keyof T]: T[P] extends Prisma.Decimal | null
      ? Exclude<T[P], Prisma.Decimal> | string
      : T[P] extends unknown[]
        ? DecimalToString<T[P][0]>[]
        : T[P] extends object
          ? DecimalToString<T[P]>
          : T[P]
  }

  import type { ChainId } from 'sushi/chain'
  import type { SushiSwapV2ChainId, SushiSwapV3ChainId } from 'sushi/config'

  type SushiV2Pool = {
    chainId: SushiSwapV2ChainId
    protocol: 'SUSHISWAP_V2'
  }

  type SushiV3Pool = {
    chainId: SushiSwapV3ChainId
    protocol: 'SUSHISWAP_V3'
  }

  export type SushiPool = DecimalToString<
    Omit<PrismaSushiPool, 'id' | 'address' | 'chainId' | 'protocol'> & {
      id: ID
      address: Address
    } & (SushiV2Pool | SushiV3Pool)
  >
}
