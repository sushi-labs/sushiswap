import type { VercelRequest, VercelResponse } from '@vercel/node'

import { SUPPORTED_CHAINS } from '../../../../config'
import { prices } from '../../../../lib/mapper'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { chainId } = request.query
  if (!SUPPORTED_CHAINS.includes(Number(chainId))) {
    response
      .status(400)
      .json({ message: 'Unsupported network. Supported chain ids: '.concat(SUPPORTED_CHAINS.join(', ')) })
  }

  return response.status(200).send(await prices(chainId as string))
}
