import { EvmChainId } from 'sushi/evm'
import { describe, expect, it } from 'vitest'
import {
  SUSHI_V2_FEE_DISPOSITION,
  SUSHI_V2_FEE_DISPOSITION_ORDER,
  SUSHI_V2_LIQUIDITY_MODE,
  getSushiV2FeeDispositionTransitions,
  getSushiV2FeeRoutes,
  getSushiV2LaunchpadAddress,
  normalizeSushiV2Distribution,
} from './contract'

describe('Sushi V2 launchpad contract adapter', () => {
  it('uses the factory deployed on the selected chain', () => {
    expect(getSushiV2LaunchpadAddress(EvmChainId.ROBINHOOD)).toBe(
      '0xf1716ebf85836ffe2985db9a50dd29e5814cabe9',
    )
    expect(getSushiV2LaunchpadAddress(EvmChainId.ARC)).toBe(
      '0xf8027a52e2c910d9fff720f311c87cb3b0e76f9a',
    )
  })

  it('keeps Solidity enum ordinals explicit', () => {
    expect(SUSHI_V2_LIQUIDITY_MODE).toEqual({ STANDARD: 0, MOON: 1 })
    expect(SUSHI_V2_FEE_DISPOSITION).toEqual({
      DIRECT_PAYOUT: 0,
      BURN_LAUNCH_TOKEN_FEES: 1,
      BUYBACK_AND_BURN: 2,
      DISTRIBUTE_TO_HOLDERS: 3,
    })
  })

  it('only exposes forward fee-disposition transitions', () => {
    expect(getSushiV2FeeDispositionTransitions('DIRECT_PAYOUT', true)).toEqual([
      'BURN_LAUNCH_TOKEN_FEES',
      'BUYBACK_AND_BURN',
      'DISTRIBUTE_TO_HOLDERS',
    ])
    expect(
      getSushiV2FeeDispositionTransitions('BURN_LAUNCH_TOKEN_FEES', true),
    ).toEqual(['BUYBACK_AND_BURN', 'DISTRIBUTE_TO_HOLDERS'])
    expect(
      getSushiV2FeeDispositionTransitions('BUYBACK_AND_BURN', true),
    ).toEqual([])
    expect(
      getSushiV2FeeDispositionTransitions('DISTRIBUTE_TO_HOLDERS', true),
    ).toEqual([])
  })

  it('does not offer holder rewards for older tokens', () => {
    expect(getSushiV2FeeDispositionTransitions('DIRECT_PAYOUT', false)).toEqual(
      ['BURN_LAUNCH_TOKEN_FEES', 'BUYBACK_AND_BURN'],
    )
    expect(
      getSushiV2FeeDispositionTransitions('BURN_LAUNCH_TOKEN_FEES', false),
    ).toEqual(['BUYBACK_AND_BURN'])
  })

  it('orders dispositions by how committed they are', () => {
    expect(
      SUSHI_V2_FEE_DISPOSITION_ORDER.map(
        (disposition) => SUSHI_V2_FEE_DISPOSITION[disposition],
      ),
    ).toEqual([0, 1, 2, 3])
  })

  it('routes each fee side by disposition', () => {
    expect(getSushiV2FeeRoutes('DIRECT_PAYOUT')).toEqual({
      launchToken: ['SUSHI', 'FEE_RECEIVER'],
      quote: ['SUSHI', 'FEE_RECEIVER'],
    })
    expect(getSushiV2FeeRoutes('BURN_LAUNCH_TOKEN_FEES')).toEqual({
      launchToken: ['SUSHI', 'BURN'],
      quote: ['SUSHI', 'FEE_RECEIVER'],
    })
    expect(getSushiV2FeeRoutes('BUYBACK_AND_BURN')).toEqual({
      launchToken: ['SUSHI', 'BURN'],
      quote: ['SUSHI', 'BUYBACK'],
    })
    expect(getSushiV2FeeRoutes('DISTRIBUTE_TO_HOLDERS')).toEqual({
      launchToken: ['SUSHI', 'BURN'],
      quote: ['SUSHI', 'HOLDERS'],
    })
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
