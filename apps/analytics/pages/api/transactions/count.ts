import { getTransactionCount, GetTransactionsQuery } from 'lib/txn_api'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const txCount = await getTransactionCount(query as GetTransactionsQuery)
  res.status(200).send(txCount)
}
