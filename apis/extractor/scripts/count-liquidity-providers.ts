#!/usr/bin/env -S pnpm tsx

import { ChainId, ChainKey } from 'sushi'
import { EXTRACTOR_CONFIG } from '../src/config'

let count = 0

const liquidityProviders: string[] = []

for (const [
  chainId,
  { factoriesV2, factoriesV3, factoriesAlgebra, factoriesAerodromeSlipstream },
] of Object.entries(EXTRACTOR_CONFIG)) {
  if (factoriesV2?.length) {
    count += factoriesV2.length
    for (const factory of factoriesV2) {
      liquidityProviders.push(
        `${factory.provider} (${ChainKey[chainId as keyof typeof ChainId]})`,
      )
    }
  }
  if (factoriesV3?.length) {
    count += factoriesV3.length
    for (const factory of factoriesV3) {
      liquidityProviders.push(
        `${factory.provider} (${ChainKey[chainId as keyof typeof ChainId]})`,
      )
    }
  }
  if (factoriesAlgebra?.length) {
    count += factoriesAlgebra.length
    for (const factory of factoriesAlgebra) {
      liquidityProviders.push(
        `${factory.provider} (${ChainKey[chainId as keyof typeof ChainId]})`,
      )
    }
  }
  if (factoriesAerodromeSlipstream?.length) {
    count += factoriesAerodromeSlipstream.length
    for (const factory of factoriesAerodromeSlipstream) {
      liquidityProviders.push(
        `${factory.provider} (${ChainKey[chainId as keyof typeof ChainId]})`,
      )
    }
  }
}

console.log('Total number of liquidity providers: ', count)
console.log(
  'Liquidity providers:\n',
  liquidityProviders.reduce((acc, provider) => `${acc}\n${provider}`, ''),
)
