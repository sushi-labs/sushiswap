import { ChainKey } from '@sushiswap/chain'

import { MAKER_CONFIG } from '../config'

export const getMakerLPs = async (chain: ChainKey | undefined) => {
  if (!chain || !Object.keys(MAKER_CONFIG).includes(chain)) {
    throw new Error('Unsupported chain. Supported chains are: '.concat(Object.keys(MAKER_CONFIG).join(', ')))
  }

  return Object.values(await MAKER_CONFIG[chain].fetcher({ id: MAKER_CONFIG[chain].address }))[0]?.liquidityPositions
}

export const getAllMakers = async () => {
  return Promise.all(
    Object.keys(MAKER_CONFIG).map((chain) =>
      Promise.resolve(MAKER_CONFIG[chain].fetcher({ id: MAKER_CONFIG[chain].address })).then((result) => ({
        network: chain,
        address: MAKER_CONFIG[chain].address,
        type: MAKER_CONFIG[chain].type,
        liquidityPositions: result,
      })),
    ),
  )
}
