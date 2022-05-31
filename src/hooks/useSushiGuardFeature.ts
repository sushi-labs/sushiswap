import { Feature } from 'app/enums/Feature'
import { featureEnabled } from 'app/functions/feature'
import { useActiveWeb3React } from 'app/services/web3'
import { useUserSushiGuard } from 'app/state/user/hooks'
import { useMemo } from 'react'

import useWalletSupportsSushiGuard from './useWalletSupportsSushiGuard'

export default function useSushiGuardFeature() {
  const { chainId } = useActiveWeb3React()
  const [userEnabledSushiGuard] = useUserSushiGuard()
  const walletSupportsSushiGuard = useWalletSupportsSushiGuard()

  return useMemo(() => {
    return featureEnabled(Feature.SUSHIGUARD, chainId ?? -1) && walletSupportsSushiGuard && userEnabledSushiGuard
  }, [chainId, userEnabledSushiGuard, walletSupportsSushiGuard])
}
