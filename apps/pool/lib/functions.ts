import { ConstantProductPool, Pair } from '@sushiswap/exchange'

export const isConstantProductPool = (pool: Pair | ConstantProductPool | null): pool is ConstantProductPool => {
  return pool instanceof ConstantProductPool
}

export const isLegacyPool = (pool: Pair | ConstantProductPool | null): pool is Pair => {
  return pool instanceof Pair
}
