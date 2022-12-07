import { getMintsCount, GetMintsCountQuery } from "lib/api"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
	const mintsCount = await getMintsCount(query as GetMintsCountQuery)
	res.status(200).send(mintsCount)
}