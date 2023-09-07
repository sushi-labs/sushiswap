import {
  ContractFunctionConfig,
  MulticallContracts,
  MulticallParameters,
  MulticallReturnType,
  PublicClient,
} from 'viem'

type ContractFunctionConfigWithChainId = ContractFunctionConfig & { chainId: number }

interface MultichainMulticallParams<
  TContracts extends ContractFunctionConfigWithChainId[],
  TAllowFailure extends boolean = true
> {
  clients: PublicClient[]
  params: MulticallParameters<TContracts, TAllowFailure> & {
    contracts: readonly [...MulticallContracts<TContracts, { chainId: number }>]
  }
}

async function multichainMulticall<
  TContracts extends ContractFunctionConfigWithChainId[],
  TAllowFailure extends boolean = true
>({
  clients,
  params,
}: MultichainMulticallParams<TContracts, TAllowFailure>): Promise<MulticallReturnType<TContracts, TAllowFailure>> {
  const paramsChainIds = Array.from(new Set(params.contracts.map((contract) => contract.chainId)))

  const inputResultIndexMap = new Map<number, number>()
  const promises = []
  for (const chainId of paramsChainIds) {
    const oneChainIdContracts = params.contracts.flatMap((contract, index) => {
      if (contract.chainId === chainId) {
        inputResultIndexMap.set(inputResultIndexMap.size, index)
        return contract
      }

      return []
    })

    const client = clients.find((client) => client.chain?.id === chainId)

    if (!client) {
      throw new Error('Missing client for a chain')
    }

    promises.push(
      client.multicall({
        ...params,
        contracts: oneChainIdContracts as typeof params.contracts,
      })
    )
  }

  const results = (await Promise.all(promises)).flat()
  const resultsMapped = new Array(params.contracts.length)

  for (const [index, result] of results.entries()) {
    const mappedIndex = inputResultIndexMap.get(index)

    if (mappedIndex === undefined) {
      throw new Error('Missing mappedIndex')
    }

    resultsMapped[mappedIndex] = result
  }

  return resultsMapped as MulticallReturnType<TContracts, TAllowFailure>
}

export { multichainMulticall }
