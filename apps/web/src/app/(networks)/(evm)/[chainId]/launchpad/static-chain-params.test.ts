import { EvmChainId, LAUNCHPAD_V2_SUPPORTED_CHAIN_IDS } from 'sushi/evm'
import { expect, it } from 'vitest'
import { getStaticChainParams } from '../get-static-chain-params'

it('generates launchpad static paths from the v2 feature map', () => {
  expect(getStaticChainParams(LAUNCHPAD_V2_SUPPORTED_CHAIN_IDS)).toEqual([
    { chainId: String(EvmChainId.ROBINHOOD) },
    { chainId: String(EvmChainId.ARC) },
  ])
})
