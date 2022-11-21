import { getSwapsCount, GetSwapsCountQuery } from "lib/swap_api"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
	const swapsCount = await getSwapsCount(query as GetSwapsCountQuery)
	res.status(200).send(swapsCount)
}