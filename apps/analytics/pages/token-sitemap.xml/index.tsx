import { getTokens, GetTokensQuery } from 'lib/api'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap, ISitemapField } from 'next-sitemap'
import stringify from 'fast-json-stable-stringify'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const tokens = await getTokens({
    pagination: stringify({ pageIndex: 0, pageSize: 1000 }),
  } as unknown as GetTokensQuery)

  const ids = tokens.map((token) => token.id)

  const fields = ids.map<ISitemapField>((id) => ({
    loc: `https://www.sushi.com/analytics/token/${id}`,
    changefreq: 'never',
  }))

  console.log(tokens.sort((a, b) => b.liquidityUSD - a.liquidityUSD)[0])

  return getServerSideSitemap(ctx, fields)
}

export default function Sitemap() {
  // Default export to prevent next.js errors
}
