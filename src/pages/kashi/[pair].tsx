import Container from 'app/components/Container'
import { useKashiMediumRiskLendingPair } from 'app/features/kashi/hooks'
import { KashiMarket, KashiMarketProvider, KashiMarketSkeleton } from 'app/features/kashi/KashiMarket'
import { useRedirectOnChainId } from 'app/hooks/useRedirectOnChainId'
import { useActiveWeb3React } from 'app/services/web3'
import { useRouter } from 'next/router'
import React, { FC } from 'react'

interface KashiPairPage {}

const KashiPairPage: FC<KashiPairPage> = () => {
  const { account } = useActiveWeb3React()
  const router = useRouter()
  const market = useKashiMediumRiskLendingPair(account, router.query.pair as string)

  useRedirectOnChainId('/kashi')

  return (
    <Container maxWidth="lg" className="py-4 md:py-12 lg:py-[120px] px-2">
      {market ? (
        <KashiMarketProvider market={market}>
          <KashiMarket />
        </KashiMarketProvider>
      ) : (
        <KashiMarketSkeleton />
      )}
    </Container>
  )
}

export default KashiPairPage
