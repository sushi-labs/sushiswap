import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import { TokenType } from 'app/features/miso/context/types'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useMemo } from 'react'

const useTokenTemplateMap = () => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()
  const templateIdToLabel = useCallback(
    (id: TokenType) => {
      return {
        [TokenType.FIXED]: i18n._(t`Fixed`),
        [TokenType.SUSHI]: i18n._(t`Sushi`),
        [TokenType.MINTABLE]: i18n._(t`Mintable`),
      }[id]
    },
    [i18n]
  )

  const map = useMemo(() => {
    if (!chainId) return undefined

    return {
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.FixedToken.address]: TokenType.FIXED,
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.SushiToken.address]: TokenType.SUSHI,
      // @ts-ignore TYPE NEEDS FIXING
      [MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MintableToken.address]: TokenType.MINTABLE,
      // @ts-ignore TYPE NEEDS FIXING
      [TokenType.FIXED]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.FixedToken,
      // @ts-ignore TYPE NEEDS FIXING
      [TokenType.SUSHI]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.SushiToken,
      // @ts-ignore TYPE NEEDS FIXING
      [TokenType.MINTABLE]: MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MintableToken,
    }
  }, [chainId])

  return {
    map,
    templateIdToLabel,
  }
}

export default useTokenTemplateMap
