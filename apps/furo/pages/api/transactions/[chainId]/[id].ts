import type { NextApiRequest, NextApiResponse } from 'next'
import { getStreamTransactions } from '../../../../graph/graph-client'
import { TransactionRepresentation } from 'features/context'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const transactions = (await getStreamTransactions(chainId as string, id as string)) as TransactionRepresentation[]
  res.status(200).send(transactions)
}
