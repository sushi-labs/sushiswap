import { getTokenLogos } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.OCTOKIT_KEY) throw new Error('Missing OCTOKIT_KEY')
  const tokenLogos = await getTokenLogos(process.env.OCTOKIT_KEY)
  res.status(200).send(tokenLogos)
}
