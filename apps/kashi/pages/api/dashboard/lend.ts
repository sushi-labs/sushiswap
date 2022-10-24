import { DEFAULT_MARKETS, SUPPORTED_CHAIN_IDS } from 'config'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getPairs } from '../../../lib/api'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const chainIds = (req.query.chianIds as string[]) || SUPPORTED_CHAIN_IDS
  const body = await Promise.all(
    DEFAULT_MARKETS.map((addressMap) =>
      Promise.all(
        chainIds
          .filter((chainId) => chainId in addressMap)
          .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
            previousValue[i] = getPairs({
              first: 1,
              orderBy: 'supplyAPR',
              orderDirection: 'desc',
              where: { asset: addressMap[currentValue].toLowerCase() },
              chainIds: [currentValue],
            })
            return previousValue
          }, [])
      ).then((pairs) =>
        pairs
          .flat()
          .sort((a, b) => {
            if (b.supplyAPR === a.supplyAPR) return 0
            return b.supplyAPR < a.supplyAPR ? -1 : 1
          })
          .slice(0, 1)
      )
    )
  ).then((pairs) =>
    pairs.flat().sort((a, b) => {
      if (b.supplyAPR === a.supplyAPR) return 0
      return b.supplyAPR < a.supplyAPR ? -1 : 1
    })
  )
  res.status(200).json(body)
}
