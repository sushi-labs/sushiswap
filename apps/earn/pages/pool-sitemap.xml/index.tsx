import { getPools, GetPoolsQuery } from '../../lib/api'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import stringify from 'fast-json-stable-stringify'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const pools = await getPools({
    pagination: stringify({ pageIndex: 0, pageSize: 1000 }),
  } as GetPoolsQuery)

  const ids = pools.map((pool) => pool.id)

  const fields = ids.map<ISitemapField>((id) => ({
    loc: `https://www.sushi.com/earn/${id}`,
    changefreq: 'never',
  }))

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
