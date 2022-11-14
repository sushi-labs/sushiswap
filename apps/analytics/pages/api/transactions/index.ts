import { getTransactions, GetTransactionsQuery } from 'lib/txn_api'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Transaction as TransactionDTO } from '.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
  const transactions = (await getTransactions(query as GetTransactionsQuery)) as TransactionDTO[]
  res.status(200).send(transactions)
}
