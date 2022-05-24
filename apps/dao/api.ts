import redis from 'redis'

export async function getSafe(address) {
  return JSON.parse(await redis.hget('safes', address))
}

export async function getSafes() {
  const safes = await redis.hvals('safes')
  const balances = await redis.hvals('balances')
  return safes.map((result, i) => {
    return { ...JSON.parse(result), balance: JSON.parse(balances[i]).fiatTotal }
  })
}

export async function getBalance(address) {
  return JSON.parse(await redis.hget('balances', address))
}

export async function getBalances() {
  const balances = await redis.hvals('balances')
  return balances.map((balance) => JSON.parse(balance))
}
