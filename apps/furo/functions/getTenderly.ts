import { ChainId } from '@sushiswap/chain'

type LogTenderlyParams = { chainId?: ChainId; from: string; to: string; data: string | undefined }
type LogTenderly = (params: LogTenderlyParams) => void

export const logTenderlyUrl: LogTenderly = async ({ chainId, from, to, data }) => {
  const req = await fetch(`/furo/api/tenderly?chainId=${chainId}&from=${from}&to=${to}&data=${data}`)
  const resp = await req.json()

  console.log(
    `Oops transaction failed! Send the following link to the Sushi Samurai: https://dashboard.tenderly.com/Sushi/furo/simulator/${resp.simulation.id}`,
  )
}
