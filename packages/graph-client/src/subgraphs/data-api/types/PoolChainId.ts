// This file is auto-generated by scripts/update-data-api-types.ts
import type { ChainId } from 'sushi/chain'

export const PoolChainIds = [
  42161, 42170, 43114, 8453, 288, 56288, 56, 42220, 1, 250, 100, 11235, 137,
  534352, 2222, 1088, 199, 314, 7000, 1116, 108, 10, 59144, 81457, 2046399126,
  30, 146, 43111, 11155111,
] as const
export type PoolChainId = (typeof PoolChainIds)[number]
export function isPoolChainId(value: ChainId): value is PoolChainId {
  return PoolChainIds.includes(value as PoolChainId)
}
