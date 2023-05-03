import { getPools } from '@sushiswap/client'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const pools = await getPools({ take: 500 })

  const ids = pools.map((pool) => pool.id)

  const fields = ids.map<ISitemapField>((id) => ({
    loc: `https://www.sushi.com/pools/${id}`,
    changefreq: 'never',
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
