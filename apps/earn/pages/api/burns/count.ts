import { getBurnsCount, GetBurnsCountQuery } from "lib/api"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query as unknown
	const burnsCount = await getBurnsCount(query as GetBurnsCountQuery)
	res.status(200).send(burnsCount)
}