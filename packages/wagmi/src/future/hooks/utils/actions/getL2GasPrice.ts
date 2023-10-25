import { readContract, readContracts } from '@wagmi/core'
import { ChainId } from 'sushi/chain'

const HAS_L1_FEE: ChainId[] = [ChainId.OPTIMISM, ChainId.ARBITRUM, ChainId.BASE]

const OPTIMISM_STACK_CHAINS = [ChainId.OPTIMISM, ChainId.BASE] as const

type OptimismStackChainId = typeof OPTIMISM_STACK_CHAINS[number]

// based on the code from the optimism OVM_GasPriceOracle contract
export function getL2ToL1GasUsed(data: string, overhead = 0n): bigint {
  // data is hex encoded
  const dataArr: string[] = data.slice(2).match(/.{1,2}/g)!
  const numBytes = dataArr.length
  let count = 0n
  for (let i = 0; i < numBytes; i += 1) {
    const byte = parseInt(dataArr[i]!, 16)
    if (byte == 0) {
      count += 4n
    } else {
      count += 16n
    }
  }
  const unsigned = overhead + count
  const signedConversion = 68 * 16
  return unsigned + BigInt(signedConversion)
}

export function calculateArbitrumToL1FeeFromCalldata(
  callData: string,
  gasData: ArbitrumGasData,
): [bigint, bigint] {
  const { perL2TxFee, perL1CalldataFee } = gasData
  console.log('gasData', gasData)
  // calculates gas amounts based on bytes of calldata, use 0 as overhead.
  const l1GasUsed = getL2ToL1GasUsed(callData)
  console.log('l1GasUsed', l1GasUsed)
  // multiply by the fee per calldata and add the flat l2 fee
  let l1Fee = l1GasUsed * perL1CalldataFee
  l1Fee = l1Fee + perL2TxFee
  return [l1GasUsed, l1Fee]
}

export function calculateOptimismToL1FeeFromCalldata(
  calldata: string,
  gasData: OptimismGasData,
): [bigint, bigint] {
  const { l1BaseFee, scalar, decimals, overhead } = gasData

  const l1GasUsed = getL2ToL1GasUsed(calldata, overhead)
  // l1BaseFee is L1 Gas Price on etherscan
  const l1Fee = l1GasUsed * l1BaseFee
  const unscaled = l1Fee * scalar
  // scaled = unscaled / (10 ** decimals)
  const scaledConversion = 10n ** decimals
  const scaled = unscaled / scaledConversion
  return [l1GasUsed, scaled]
}

export type OptimismGasData = {
  l1BaseFee: bigint
  scalar: bigint
  decimals: bigint
  overhead: bigint
}

export const getOptimismGasData = async (
  chainId: OptimismStackChainId,
): Promise<OptimismGasData> => {
  const gasPriceOracleConfig = {
    chainId,
    address: '0x420000000000000000000000000000000000000F',
    abi: [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'pure',
        type: 'function',
      },
      {
        inputs: [],
        name: 'l1BaseFee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'overhead',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'scalar',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  } as const

  const gasData = await readContracts({
    contracts: [
      {
        ...gasPriceOracleConfig,
        functionName: 'l1BaseFee',
      },
      {
        ...gasPriceOracleConfig,
        functionName: 'scalar',
      },
      {
        ...gasPriceOracleConfig,
        functionName: 'decimals',
      },
      {
        ...gasPriceOracleConfig,
        functionName: 'overhead',
      },
    ],
  })

  if (
    gasData[0]?.error ||
    gasData[1]?.error ||
    gasData[2]?.error ||
    gasData[3]?.error
  ) {
    throw new Error(
      'Failed to get gas constants data from the optimism gas oracle',
    )
  }

  const { result: l1BaseFee } = gasData[0]
  const { result: scalar } = gasData[1]
  const { result: decimals } = gasData[2]
  const { result: overhead } = gasData[3]

  return {
    l1BaseFee,
    scalar,
    decimals,
    overhead,
  }
}

/**
 * perL2TxFee is the base fee in wei for an l2 transaction.
 * perL2CalldataFee is the fee in wei per byte of calldata the swap uses. Multiply by the total bytes of the calldata.
 * perArbGasTotal is the fee in wei per unit of arbgas. Multiply this by the estimate we calculate based on ticks/hops in the gasModel.
 */
export type ArbitrumGasData = {
  perL2TxFee: bigint
  perL1CalldataFee: bigint
  perArbGasTotal: bigint
}

export const getArbitrumGasData = async (): Promise<ArbitrumGasData> => {
  const gasData = await readContract({
    chainId: ChainId.ARBITRUM,
    address: '0x000000000000000000000000000000000000006C',
    abi: [
      {
        inputs: [],
        name: 'getPricesInWei',
        outputs: [
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'uint256', name: '', type: 'uint256' },
        ],
        stateMutability: 'view',
        type: 'function',
      } as const,
    ],
    functionName: 'getPricesInWei',
  })

  return {
    perL2TxFee: gasData[0],
    perL1CalldataFee: gasData[1],
    perArbGasTotal: gasData[5],
  }
}

export const calculateGasUsed = async ({
  chainId,
  gasPrice,
  gasSpent,
  txCallData,
}: {
  chainId: ChainId
  gasPrice: bigint // in wei
  gasSpent: bigint // from tines
  txCallData: `0x${string}`
}) => {
  // calculate L2 to L1 security fee if relevant
  let l2toL1FeeInWei = 0n

  if (HAS_L1_FEE.includes(chainId)) {
    if (OPTIMISM_STACK_CHAINS.includes(chainId as OptimismStackChainId)) {
      const gasData = await getOptimismGasData(chainId as OptimismStackChainId)
      l2toL1FeeInWei = calculateOptimismToL1FeeFromCalldata(
        txCallData,
        gasData,
      )[1]
    } else if (chainId === ChainId.ARBITRUM) {
      const gasData = await getArbitrumGasData()
      l2toL1FeeInWei = calculateArbitrumToL1FeeFromCalldata(
        txCallData,
        gasData,
      )[1]
      console.log('l2toL1FeeInWei', l2toL1FeeInWei)
    }
  }

  const gasCostInWei = gasPrice * gasSpent + l2toL1FeeInWei

  return gasCostInWei
}
