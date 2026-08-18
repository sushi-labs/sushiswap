import { describe, expect, it } from 'vitest'
import {
  SUSHI_V2_FEE_DISPOSITION,
  SUSHI_V2_LIQUIDITY_MODE,
  getSushiV2FeeDispositionTransitions,
  normalizeSushiV2Distribution,
} from './contract'

describe('Sushi V2 launchpad contract adapter', () => {
  it('keeps Solidity enum ordinals explicit', () => {
    expect(SUSHI_V2_LIQUIDITY_MODE).toEqual({ STANDARD: 0, MOON: 1 })
    expect(SUSHI_V2_FEE_DISPOSITION).toEqual({
      DIRECT_PAYOUT: 0,
      BURN_LAUNCH_TOKEN_FEES: 1,
      BUYBACK_AND_BURN: 2,
    })
  })

  it('only exposes forward fee-disposition transitions', () => {
    expect(getSushiV2FeeDispositionTransitions('DIRECT_PAYOUT')).toEqual([
      'BURN_LAUNCH_TOKEN_FEES',
      'BUYBACK_AND_BURN',
    ])
    expect(
      getSushiV2FeeDispositionTransitions('BURN_LAUNCH_TOKEN_FEES'),
    ).toEqual(['BUYBACK_AND_BURN'])
    expect(getSushiV2FeeDispositionTransitions('BUYBACK_AND_BURN')).toEqual([])
  })

  it('normalizes all distributed quote and launch-token fees', () => {
    expect(
      normalizeSushiV2Distribution({
        quoteToSushi: 2n,
        launchTokenToSushi: 3n,
        quoteToReceiver: 5n,
        launchTokenToReceiver: 7n,
        launchTokenFeesBurned: 11n,
        quoteUsedForBuyback: 13n,
        launchTokenBoughtAndBurned: 17n,
      }),
    ).toMatchObject({ quoteCollected: 20n, tokenCollected: 21n })
  })
})
