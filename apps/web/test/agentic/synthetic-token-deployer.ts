import { execFile } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import type { Abi, Hex } from 'viem'
import { encodeDeployData } from 'viem'
import type { ForkController } from './fork-controller'
import { isRecord } from './json-rpc'
import { waitForSuccessfulReceipt } from './receipt'

const execFileAsync = promisify(execFile)
const contractsRoot = join(dirname(fileURLToPath(import.meta.url)), 'contracts')

export const SYNTHETIC_TOKEN_CONTRACTS = [
  'Bytes32MetadataToken',
  'ConfigurableTransferToken',
  'FalseApproveToken',
  'HighGasApproveToken',
  'LongMetadataToken',
  'NoReturnApproveToken',
  'RebaseToken',
  'RejectMaxApproveToken',
  'RevertingMetadataToken',
  'ZeroFirstApproveToken',
] as const

export type SyntheticTokenContract = (typeof SYNTHETIC_TOKEN_CONTRACTS)[number]

export async function compileSyntheticTokens(): Promise<void> {
  await execFileAsync('forge', ['build', '--root', contractsRoot], {
    timeout: 120_000,
  })
}

export async function deploySyntheticToken(
  controller: ForkController,
  contract: SyntheticTokenContract,
  sender: `0x${string}`,
): Promise<`0x${string}`> {
  const artifact = await readArtifact(contract)
  const data = encodeDeployData({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
  })
  const hash = await controller.requestAdmin<Hex>('eth_sendTransaction', [
    { data, from: sender },
  ])
  const receipt = await waitForSuccessfulReceipt(controller, hash)
  const raw = await controller.requestAdmin<unknown>(
    'eth_getTransactionReceipt',
    [receipt.transactionHash],
  )
  if (
    !isRecord(raw) ||
    typeof raw.contractAddress !== 'string' ||
    !/^0x[0-9a-f]{40}$/i.test(raw.contractAddress)
  ) {
    throw new Error(`Deployment of ${contract} returned no contract address`)
  }
  return raw.contractAddress as `0x${string}`
}

async function readArtifact(
  contract: SyntheticTokenContract,
): Promise<{ readonly abi: Abi; readonly bytecode: Hex }> {
  const path = join(
    contractsRoot,
    'out',
    'adversarial-tokens.sol',
    `${contract}.json`,
  )
  const parsed: unknown = JSON.parse(await readFile(path, 'utf8'))
  if (
    !isRecord(parsed) ||
    !Array.isArray(parsed.abi) ||
    !isRecord(parsed.bytecode) ||
    typeof parsed.bytecode.object !== 'string' ||
    !/^0x[0-9a-f]+$/i.test(parsed.bytecode.object)
  ) {
    throw new Error(`Foundry artifact for ${contract} is malformed`)
  }
  return {
    abi: parsed.abi as Abi,
    bytecode: parsed.bytecode.object as Hex,
  }
}
