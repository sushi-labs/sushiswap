import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { ChainId } from '@sushiswap/core-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback } from 'react'

const DEFAULT_NETWORK = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.MATIC]: 'matic',
}

const DEFAULT_CRYPTO_CURRENCY = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC]: 'BNB',
  [ChainId.MATIC]: 'MATIC',
}

export default function Buy() {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const onClick = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (!(chainId in DEFAULT_NETWORK)) {
      return
    }

    const widget = new RampInstantSDK({
      // @ts-ignore TYPE NEEDS FIXING
      userAddress: account,
      hostAppName: 'SUSHI',
      // @ts-ignore TYPE NEEDS FIXING
      defaultAsset: DEFAULT_CRYPTO_CURRENCY[chainId],
    })

    widget.show()
  }, [account, chainId])

  return (
    <a
      id={`buy-link`}
      onClick={onClick}
      className="p-2 cursor-pointer text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
    >
      {i18n._(t`Buy`)}
    </a>
  )
}
