import { getRebase } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { Rebase as RebaseDTO } from '../../../../.graphclient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, id } = req.query
  const rebase = (await getRebase(chainId as string, id as string)) as RebaseDTO
  res.status(200).send(rebase)
}
