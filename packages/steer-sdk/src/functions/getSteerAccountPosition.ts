import { getChainIdAddressFromId } from 'sushi/format'
import type { Address, PublicClient } from 'viem'

import { getBalanceOfsContracts } from 'src/fetchers/getBalanceOf.js'
import { getTotalSuppliesContracts } from 'src/fetchers/getTotalSupply.js'
import { multichainMulticall } from '../helpers/multichainMulticall.js'
import { getSteerVaultsReserves } from './getSteerVaultReserves.js'

interface GetSteerAccountPositions {
  clients: PublicClient[]
  account: Address
  vaultIds: string[]
}

async function getSteerAccountPositions({
  clients,
  account,
  vaultIds,
}: GetSteerAccountPositions) {
  const accountBalancesP = multichainMulticall({
    clients,
    params: {
      allowFailure: true,
      contracts: getBalanceOfsContracts({ account, vaultIds }),
    },
  })

  const totalSuppliesP = multichainMulticall({
    clients,
    params: {
      allowFailure: true,
      contracts: getTotalSuppliesContracts({ vaultIds }),
    },
  })

  const vaultReservesP = getSteerVaultsReserves({ clients, vaultIds })

  const [accountBalances, totalSupplies, vaultReserves] = await Promise.all([
    accountBalancesP,
    totalSuppliesP,
    vaultReservesP,
  ])

  return vaultIds.map((_, i) => {
    const accountBalance = accountBalances[i]!.result
    const totalSupply = totalSupplies[i]!.result
    const vaultReserve = vaultReserves[i]

    if (
      typeof accountBalance === 'undefined' ||
      typeof totalSupply === 'undefined' ||
      !vaultReserve
    ) {
      return null
    }

    let token0Balance = 0n
    let token1Balance = 0n

    if (totalSupply !== 0n) {
      token0Balance = (vaultReserve.reserve0 * accountBalance) / totalSupply
      token1Balance = (vaultReserve.reserve1 * accountBalance) / totalSupply
    }

    const { address, chainId } = getChainIdAddressFromId(_)
    return {
      address,
      chainId,
      steerTokenBalance: accountBalance,
      steerTokenSupply: totalSupply,
      token0Balance,
      token1Balance,
    }
  })
}

interface GetSteerAccountPosition {
  client: PublicClient
  account: Address
  vaultId: string
}

async function getSteerAccountPosition({
  client,
  account,
  vaultId,
}: GetSteerAccountPosition) {
  return (
    await getSteerAccountPositions({
      clients: [client],
      account,
      vaultIds: [vaultId],
    })
  )[0]
}

export { getSteerAccountPosition, getSteerAccountPositions }
