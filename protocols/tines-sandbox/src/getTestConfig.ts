import hre from 'hardhat'
import { ChainId } from 'sushi/chain'
import {
  Client,
  Hex,
  createPublicClient,
  custom,
  testActions,
  walletActions,
} from 'viem'
import {
  HDAccount,
  PrivateKeyAccount,
  mnemonicToAccount,
  privateKeyToAccount,
} from 'viem/accounts'
import { hardhat } from 'viem/chains'

const { config, network } = hre

const POLLING_INTERVAL = process.env.ALCHEMY_ID ? 1_000 : 10_000

export interface TestConfig {
  client: Client
  user: HDAccount | PrivateKeyAccount
  chainId: ChainId
}

export async function getTestConfig(): Promise<TestConfig> {
  const chainId = network.config.chainId as ChainId

  let user

  const accounts = config.networks.hardhat.accounts as
    | { mnemonic: string }
    | [{ privateKey: Hex }]
  if (Array.isArray(accounts)) {
    user = privateKeyToAccount(accounts[0].privateKey)
  } else {
    user = mnemonicToAccount(accounts.mnemonic, { accountIndex: 0 })
  }

  const client = createPublicClient({
    batch: {
      multicall: {
        batchSize: 2048,
        wait: 1,
      },
    },
    chain: {
      ...hardhat,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 25770160,
        },
      },
      pollingInterval: POLLING_INTERVAL,
    },
    transport: custom(network.provider),
  })
    .extend(testActions({ mode: 'hardhat' }))
    .extend(walletActions) as Client

  return { client, user, chainId }
}
