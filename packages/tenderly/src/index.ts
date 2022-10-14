export async function simulate({
  chainId,
  from,
  to,
  data,
}: {
  chainId: number
  from: string
  to: string
  data: string
}) {
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
  return fetch(apiURL, {
    method: 'post',
    body: JSON.stringify(body),
    headers,
  })
}
