import { ChainId } from 'sushi/chain'
import {
  Address,
  Hex,
  PublicClient,
  WalletClient,
  createPublicClient,
  custom,
  walletActions,
} from 'viem'
import { hardhat } from 'viem/chains'
import RouteProcessor4 from '../test/RouteProcessor4.sol/RouteProcessor4.json' assert {
  type: 'json',
}
import { createHardhatProvider } from './CreateHardhatProvider.js'

export async function createForkRouteProcessor4(
  providerUrl: string,
  forkBlockNumber: bigint,
  chainId: ChainId,
): Promise<{
  client: PublicClient & WalletClient
  deployUser: Address
  RouteProcessorAddress: Address | null
}> {
  const forkProvider = await createHardhatProvider(
    chainId,
    providerUrl,
    Number(forkBlockNumber),
  )
  const client = createPublicClient({
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 100,
        },
      },
      id: chainId,
    },
    transport: custom(forkProvider),
  }).extend(walletActions)
  const [deployUser] = await client.getAddresses()
  const RouteProcessorTx = await client.deployContract({
    chain: null,
    abi: RouteProcessor4.abi,
    bytecode: RouteProcessor4.bytecode as Hex,
    account: deployUser,
    args: ['0x0000000000000000000000000000000000000000', []],
  })
  const RouteProcessorAddress = (
    await client.waitForTransactionReceipt({ hash: RouteProcessorTx })
  ).contractAddress

  return {
    client,
    deployUser,
    RouteProcessorAddress: RouteProcessorAddress as Address,
  }
}
