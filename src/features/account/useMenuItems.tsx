import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { BentoboxIcon, PoolIcon, WalletIcon } from 'app/components/Icon'
import { useRouter } from 'next/router'
import React from 'react'

const useMenuItems = () => {
  const { i18n } = useLingui()
  const router = useRouter()
  const account = router.query.address as string
  return [
    {
      key: 'wallet',
      label: i18n._(t`Wallet`),
      icon: <WalletIcon width={20} height={20} />,
      link: `/account/${account}/wallet`,
    },
    {
      key: 'bentobox',
      label: i18n._(t`BentoBox`),
      icon: <BentoboxIcon width={20} height={20} />,
      link: `/account/${account}/bentobox`,
    },
    {
      key: 'liquidity',
      label: i18n._(t`Liquidity Pools`),
      icon: <PoolIcon width={20} height={20} />,
      link: `/account/${account}/liquidity-pools`,
    },
  ]
}

export default useMenuItems
