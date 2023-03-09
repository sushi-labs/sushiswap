import type { NextApiRequest, NextApiResponse } from 'next'

import type { Transaction as TransactionDTO } from '../../../../../.graphclient'
import { getStreamTransactions } from '../../../../../lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const transactions = (await getStreamTransactions(chainId as string, id as string)) as TransactionDTO[]
  res.status(200).send(transactions)
}
