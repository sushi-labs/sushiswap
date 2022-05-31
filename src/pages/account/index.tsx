import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ActionsModal from 'app/features/portfolio/ActionsModal'
import { BentoBalances, WalletBalances } from 'app/features/portfolio/AssetBalances/bentoAndWallet'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import React from 'react'

const Portfolio = () => {
  const { i18n } = useLingui()

  const router = useRouter()

  const account = router.query.account as string
  const chainId = router.query.account ? Number(router.query.chainId) : undefined

  if (!account || !chainId) return null

  return (
    <>
      <NextSeo title={`${i18n._(t`Account`)} ${account}`} />
      <TridentHeader pattern="bg-chevron">
        <HeaderDropdown account={account} chainId={chainId} />
      </TridentHeader>
      <TridentBody className="flex flex-col grid-cols-2 gap-10 lg:grid lg:gap-4">
        <WalletBalances account={account} chainId={chainId} />
        <BentoBalances account={account} chainId={chainId} />
      </TridentBody>
      <ActionsModal />
    </>
  )
}

Portfolio.Layout = TridentLayout

export default Portfolio
