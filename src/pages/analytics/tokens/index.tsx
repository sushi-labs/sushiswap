import { DiscoverHeader } from 'app/features/analytics/tokens/DiscoverHeader'
import TokenSearch from 'app/features/analytics/tokens/TokenSearch'
import TokenTable from 'app/features/analytics/tokens/TokenTable'
import { TridentBody } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
export default function Tokens() {
  const router = useRouter()

  const chainId = Number(router.query.chainId)

  return (
    <>
      <NextSeo title={`Token Anlytics`} />
      <DiscoverHeader />
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <TokenSearch />
          <TokenTable chainId={chainId} />
        </div>
      </TridentBody>
    </>
  )
}
