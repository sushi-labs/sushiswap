import { isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { getToken } from 'lib'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const address = req.query.address as string
  const chainId = Number(req.query.chainId) as unknown as ChainId

  if (!address || !chainId || !isAddress(address)) {
    res.status(400).end()
    return
  }

  try {
    const data = await getToken(address, chainId)
    res.status(200).json(data)
  } catch (er) {
    console.log(er)
    res.status(500).end()
  }
}

export default handler
