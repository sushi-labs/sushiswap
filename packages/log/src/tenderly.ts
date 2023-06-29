import { ChainId } from '@sushiswap/chain'
import fetch from 'isomorphic-unfetch'

type LogTenderlyParams = {
  chainId?: typeof ChainId[keyof typeof ChainId]
  from?: string
  to?: string
  data?: string
  value?: string
}

type LogTenderly = (params: LogTenderlyParams) => void

const tenderly: LogTenderly = async ({ chainId, from, to, data, value }) => {
  const req = await fetch(`/furo/api/tenderly?chainId=${chainId}&from=${from}&to=${to}&data=${data}&value=${value}`)
  const resp = await req.json()

  console.log(
    `Oops transaction failed! Send the following link to the Sushi Samurai: https://dashboard.tenderly.co/Sushi/furo/simulator/${resp.simulation.id}`
  )
}

export default tenderly
