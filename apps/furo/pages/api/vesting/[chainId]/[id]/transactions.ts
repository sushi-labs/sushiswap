import { getVestingTransactions } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Transaction as TransactionDTO } from '.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const transactions = (await getVestingTransactions(chainId as string, id as string)) as TransactionDTO[]
  res.status(200).send(transactions)
}
