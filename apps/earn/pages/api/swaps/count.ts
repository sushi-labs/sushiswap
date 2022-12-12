import { getSwapsCount } from "lib/api"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, pairId } = req.query
	const swapsCount = await getSwapsCount(Number(chainId), pairId as string)
	res.status(200).send(swapsCount)
}