import { getSubgraphs } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const subgraphs = await getSubgraphs({
    filter: req?.query?.filter as string,
  })
  res.status(200).send(subgraphs)
}
