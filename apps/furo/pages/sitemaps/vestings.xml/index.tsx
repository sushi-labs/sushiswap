import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

import { SUPPORTED_CHAINS } from '../../../config'
import { getVestingIds } from '../../../lib'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const networks = await Promise.all(
    SUPPORTED_CHAINS.map((chainId) =>
      getVestingIds(String(chainId)).then((vestings) => vestings.map((vesting) => ({ ...vesting, chainId })))
    )
  )

  const fields = networks.flat(2).map<ISitemapField>((vesting) => ({
    loc: `https://www.sushi.com/furo/vesting/${vesting.id}?chainId=${vesting.chainId}`,
    changefreq: 'never',
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
