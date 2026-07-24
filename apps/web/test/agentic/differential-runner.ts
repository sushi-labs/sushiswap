import type { EvmAddress } from 'sushi/evm'
import type { Hex } from 'viem'
import type { ForkController } from './fork-controller'
import type { JsonValue } from './json-rpc'
import { waitForReceipt } from './receipt'
import {
  type SimulationClassification,
  classifyTrace,
} from './simulation-classifier'
import { type SwapTransaction, transactionToRpc } from './swap-api-proxy'

export interface AssetBalanceReader {
  readonly label: string
  read(account: EvmAddress): Promise<bigint>
}

export interface DifferentialRunnerOptions {
  readonly controller: ForkController
  readonly input: AssetBalanceReader
  readonly minimumOutput: bigint
  readonly output: AssetBalanceReader
  readonly sender: EvmAddress
  readonly transaction: SwapTransaction
}

export interface DifferentialResult {
  readonly differential: boolean
  readonly execution: {
    readonly classification: SimulationClassification
    readonly gasUsed: bigint
    readonly inputDelta: bigint
    readonly logs: readonly unknown[]
    readonly outputDelta: bigint
    readonly transactionHash: Hex
  }
  readonly minimumOutputEnforced: boolean
  readonly simulation: {
    readonly classification: SimulationClassification
    readonly trace: unknown
  }
}

export async function runSimulationExecutionDifferential({
  controller,
  input,
  minimumOutput,
  output,
  sender,
  transaction,
}: DifferentialRunnerOptions): Promise<DifferentialResult> {
  const snapshot = await controller.snapshot()

  try {
    const inputBefore = await input.read(sender)
    const outputBefore = await output.read(sender)
    const simulationTrace = await controller.requestAdmin<unknown>(
      'debug_traceCall',
      [transactionToRpc(transaction), 'latest', { tracer: 'callTracer' }],
    )
    const simulation = classifyTrace(simulationTrace)

    // Execution intentionally happens even when simulation rejects. This is the
    // signal needed to expose false-negative simulation classifications.
    const transactionHash = await controller.requestAdmin<Hex>(
      'eth_sendTransaction',
      [transactionToRpc(transaction)],
    )
    const receipt = await waitForReceipt(controller, transactionHash)
    const executionTrace = await controller.requestAdmin<unknown>(
      'debug_traceTransaction',
      [transactionHash, { tracer: 'callTracer' }],
    )
    const execution = classifyTrace(executionTrace)
    const inputAfter = await input.read(sender)
    const outputAfter = await output.read(sender)
    const inputDelta = inputBefore - inputAfter
    const outputDelta = outputAfter - outputBefore

    return {
      differential: simulation.classification !== execution.classification,
      execution: {
        classification: execution.classification,
        gasUsed: receipt.gasUsed,
        inputDelta,
        logs: receipt.logs,
        outputDelta,
        transactionHash,
      },
      minimumOutputEnforced:
        execution.classification !== 'success' || outputDelta >= minimumOutput,
      simulation: {
        classification: simulation.classification,
        trace: simulationTrace,
      },
    }
  } finally {
    await controller.revert(snapshot)
  }
}

export function nativeBalanceReader(
  controller: ForkController,
): AssetBalanceReader {
  return {
    label: 'native',
    async read(account) {
      const balance = await controller.requestAdmin<string>('eth_getBalance', [
        account,
        'latest',
      ])
      return BigInt(balance)
    },
  }
}

export function rpcCallBalanceReader(
  controller: ForkController,
  label: string,
  request: (account: EvmAddress) => {
    readonly call: Readonly<Record<string, JsonValue>>
    decode(value: Hex): bigint
  },
): AssetBalanceReader {
  return {
    label,
    async read(account) {
      const { call, decode } = request(account)
      const result = await controller.requestAdmin<Hex>('eth_call', [
        call,
        'latest',
      ])
      return decode(result)
    },
  }
}
