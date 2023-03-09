import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

import { SUPPORTED_CHAINS } from '../../../config'
import { getStreamIds } from '../../../lib'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const networks = await Promise.all(
    SUPPORTED_CHAINS.map((chainId) =>
      getStreamIds(String(chainId)).then((streams) => streams.map((stream) => ({ ...stream, chainId })))
    )
  )

  const fields = networks.flat(2).map<ISitemapField>((stream) => ({
    loc: `https://www.sushi.com/furo/stream/${stream.id}?chainId=${stream.chainId}`,
    changefreq: 'never',
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
