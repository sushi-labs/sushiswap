#!/usr/bin/env -S pnpm tsx

import { EXTRACTOR_CONFIG } from '../src/config'

let count = 0

for (const {
  factoriesV2,
  factoriesV3,
  factoriesAlgebra,
  factoriesAerodromeSlipstream,
} of Object.values(EXTRACTOR_CONFIG)) {
  count += factoriesV2?.length ?? 0
  count += factoriesV3?.length ?? 0
  count += factoriesAlgebra?.length ?? 0
  count += factoriesAerodromeSlipstream?.length ?? 0
}

console.log('Total number of liquidity providers: ', count)
