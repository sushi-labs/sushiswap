import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { AuctionTemplate } from 'app/features/miso/context/types'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useMemo } from 'react'

const useAuctionTemplateMap = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const templateIdToLabel = useCallback(
    (id: AuctionTemplate) => {
      return {
        [AuctionTemplate.NOT_SET]: i18n._(t`Not set`),
        [AuctionTemplate.CROWDSALE]: i18n._(t`Crowdsale`),
        [AuctionTemplate.DUTCH_AUCTION]: i18n._(t`Dutch Auction`),
        [AuctionTemplate.BATCH_AUCTION]: i18n._(t`Batch Auction`),
        [AuctionTemplate.HYPERBOLIC_AUCTION]: i18n._(t`Hyperbolic Auction`),
      }[id]
    },
    [i18n]
  )

  const map = useMemo(() => {
    if (!chainId) return undefined

    return {
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.Crowdsale.address]: AuctionTemplate.CROWDSALE,
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.DutchAuction.address]: AuctionTemplate.DUTCH_AUCTION,
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.BatchAuction.address]: AuctionTemplate.BATCH_AUCTION,
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.HyperbolicAuction.address]: AuctionTemplate.HYPERBOLIC_AUCTION,
      // @ts-ignore TYPE NEEDS FIXING
      [AuctionTemplate.CROWDSALE]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.Crowdsale,
      // @ts-ignore TYPE NEEDS FIXING
      [AuctionTemplate.DUTCH_AUCTION]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.DutchAuction,
      // @ts-ignore TYPE NEEDS FIXING
      [AuctionTemplate.BATCH_AUCTION]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.BatchAuction,
      // @ts-ignore TYPE NEEDS FIXING
      [AuctionTemplate.HYPERBOLIC_AUCTION]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.HyperbolicAuction,
    }
  }, [chainId])

  return {
    map,
    templateIdToLabel,
  }
}

export default useAuctionTemplateMap
