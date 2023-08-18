import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { readContracts } from '@wagmi/core'

async function getSteerVaultsReserves(vaultIds: string[]) {
  const result = await readContracts({
    allowFailure: true,
    contracts: vaultIds.map((id) => {
      const { chainId, address } = getChainIdAddressFromId(id)

      return {
        abi: steerMultiPositionManager,
        chainId,
        address,
        functionName: 'getTotalAmounts' as const,
      }
    }),
  })

  return result.map((res) =>
    res[0] && res[1] ? ({ reserve0: BigInt(res[0].toString()), reserve1: BigInt(res[1].toString()) } as const) : null
  )
}

async function getSteerVaultReserves(vaultId: string) {
  return (await getSteerVaultsReserves([vaultId]))[0]
}

export { getSteerVaultReserves, getSteerVaultsReserves }
