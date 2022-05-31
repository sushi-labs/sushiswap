import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import FarmSearch from 'app/features/analytics/farms/FarmSearch'
import FarmTable from 'app/features/analytics/farms/FarmTable'
import useFarmRewards from 'app/hooks/useFarmRewards'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function Farms(): JSX.Element {
  const { i18n } = useLingui()
  const router = useRouter()
  const chainId = Number(router.query.chainId)
  const farms = useFarmRewards({ chainId })
  return (
    <>
      <NextSeo title={`Farm Analytics`} />
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`Farm Analytics.`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Farms are incentivized pools. Click on the column name to sort by APR or volume.`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>
        <div className="flex flex-col w-full gap-10">
          <FarmSearch />
          <FarmTable chainId={chainId} farms={farms} />
        </div>
      </TridentBody>
    </>
  )
}
