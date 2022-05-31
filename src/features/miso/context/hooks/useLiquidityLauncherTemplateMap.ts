import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { LiquidityLauncherTemplate } from 'app/features/miso/context/types'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useMemo } from 'react'

export const useLiquidityLauncherTemplateMap = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const templateIdToLabel = useCallback(
    (id: LiquidityLauncherTemplate) => {
      return {
        [LiquidityLauncherTemplate.PostAuctionLauncher]: i18n._(t`Post Auction Launcher`),
      }[id]
    },
    [i18n]
  )

  const map = useMemo(() => {
    if (!chainId) return undefined

    return {
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PostAuctionLauncher.address]:
        LiquidityLauncherTemplate.PostAuctionLauncher,
      [LiquidityLauncherTemplate.PostAuctionLauncher]:
        // @ts-ignore TYPE NEEDS FIXING
        MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.PostAuctionLauncher,
    }
  }, [chainId])

  return {
    map,
    templateIdToLabel,
  }
}
