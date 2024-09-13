async function providerTest(name, provider) {
  const resp = await fetch(provider, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getLogs',
      params: [
        {
          // Aerodrome Slipstream CLPool
          address: ['0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A'],
          fromBlock: '0x0',
          toBlock: 'latest',
          //address: ['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'],
        },
      ],
      id: 1,
    }),
  })
  const { result } = await resp.json()
  console.log(name, result.length)
}

providerTest(
  'DRPC',
  `https://lb.drpc.org/ogrpc?network=base&dkey=${process.env.DRPC_ID}`,
)
providerTest(
  'ALCHEMY',
  `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
)
