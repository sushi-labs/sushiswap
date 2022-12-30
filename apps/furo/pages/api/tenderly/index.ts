import stringify from 'fast-json-stable-stringify'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chainId, from, to, data } = req.query
  const apiURL = `https://api.tenderly.co/api/v1/account/Sushi/project/furo/simulate`
  const body = {
    network_id: chainId?.toString(),
    from: from,
    to: to,
    input: data,
    gas: 8000000,
    gas_price: '0',
    value: 0,
    save_if_fails: true,
  }

  const headers = {
    'content-type': 'application/JSON',
    'X-Access-Key': process.env.TENDERLY_ACCESS_KEY as string,
  }

  const call = await fetch(apiURL, {
    method: 'post',
    body: stringify(body),
    headers,
  })

  const resp = await call.json()
  res.status(200).send(resp)
}
