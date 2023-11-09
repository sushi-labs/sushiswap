
const delay = async (ms) => new Promise((res) => setTimeout(res, ms))

async function providerTest(name, provider) {
  const resp = await fetch(provider, {
    method: 'POST',
    body: JSON.stringify({
      "jsonrpc":"2.0",
      "method":"eth_newFilter",
      params: [{
        // UniV2 pool event Sync(uint112 reserve0, uint112 reserve1)
        topics: ['0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1']
      }],
      id: 1
    })
  })
  const {result: filter} = await resp.json()
  for(;;) {
    const resp = await fetch(provider, {
      method: 'POST',
      body: JSON.stringify({
        "jsonrpc":"2.0",
        "method":"eth_getFilterChanges",
        params: [filter],
        id: 1
      })
    })
    const {result: logs} = await resp.json()
    console.log(`Provider ${name} found logs: ${logs.length}`)
    await delay(3000)
  }
}

providerTest('DRPC', `https://lb.drpc.org/ogrpc?network=arbitrum&dkey=${process.env.DRPC_ID}`)
providerTest('ALCHEMY', `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`)
