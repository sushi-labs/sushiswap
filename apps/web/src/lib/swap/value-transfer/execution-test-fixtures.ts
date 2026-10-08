import { EvmToken } from 'sushi/evm'
import {
  valueTransferBuildUserStepsResponseSchema,
  valueTransferQuoteSchema,
} from './schemas'
import { normalizeValueTransferTrade } from './trade'

const quoteFixture = {
  id: '0x0000000000000000000000000000000001a118d04e88720eae61f707f315b8b1',
  routeSteps: [
    {
      type: 'STARGATE_V2_TAXI',
      srcChainKey: 'base',
      description: 'Stargate',
    },
  ],
  fees: [
    {
      chainKey: 'base',
      type: 'MESSAGE',
      description: '',
      amount: '110151000120986',
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
  ],
  duration: {
    estimated: '104720',
  },
  feeUsd: '0.28954929',
  feePercent: '2.89612251',
  srcAmount: '10000000',
  dstAmount: '9993929',
  dstAmountMin: '9893989',
  srcAmountUsd: '9.99782613',
  dstAmountUsd: '9.99175645',
  userSteps: [
    {
      type: 'TRANSACTION',
      description: 'approve',
      chainKey: 'base',
      chainType: 'EVM',
      signerAddress: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
      transaction: {
        encoded: {
          chainId: 8453,
          data: '0x095ea7b30000000000000000000000008eca03175fd5ac62fb6f4ecbb9a95d13dcdcb4f80000000000000000000000000000000000000000000000000000000000989680',
          from: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
          to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        },
      },
    },
    {
      type: 'TRANSACTION',
      description: 'bridge',
      chainKey: 'base',
      chainType: 'EVM',
      signerAddress: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
      transaction: {
        encoded: {
          chainId: 8453,
          data: '0x571d3dc700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000001a118d04e88720eae61f707f315b8b10000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000005000000000000000000000000008eca03175fd5ac62fb6f4ecbb9a95d13dcdcb4f8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000084eac6f3fe000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000ff64c2d5e23e9c48e8b42a23dc70055eec9ea0980000000000000000000000007e07a9148e9149e430c6412b79a675028595ff1f000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000000000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044095ea7b300000000000000000000000027a16dc786820b16e5c9028b75b99f6f604b5d2600000000000000000000000000000000000000000000000000000000009896800000000000000000000000000000000000000000000000000000000000000000000000000000000027a16dc786820b16e5c9028b75b99f6f604b5d260000000000000000000000000000000000000000000000000000642e873bde9a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001e4c7c7f5b300000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000642e873bde9a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e07a9148e9149e430c6412b79a675028595ff1f000000000000000000000000000000000000000000000000000000000000759e000000000000000000000000ff64c2d5e23e9c48e8b42a23dc70055eec9ea0980000000000000000000000000000000000000000000000000000000000989680000000000000000000000000000000000000000000000000000000000096f86500000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000002000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007e07a9148e9149e430c6412b79a675028595ff1f0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a4d20c88bd0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000ff64c2d5e23e9c48e8b42a23dc70055eec9ea0980000000000000000000000000000000000000000000000000000000000000002000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          from: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
          to: '0x7e07A9148E9149e430C6412b79A675028595Ff1f',
          value: '110151000120986',
        },
      },
    },
  ],
  options: {
    dstNativeDropAmount: '0',
  },
}

const aoriFixture = {
  id: '0x0000000000000000000000000000000001a118d04ebc76369ef2f5ef4de5e8bf',
  routeSteps: [
    {
      type: 'AORI_V1',
      srcChainKey: 'base',
      description: 'Aori',
    },
  ],
  fees: [
    {
      chainKey: 'base',
      type: 'GENERAL',
      description: 'Aori Fees',
      amount: '20497',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  ],
  duration: {
    estimated: '3000',
  },
  feeUsd: '0.02049254',
  feePercent: '0.20497',
  srcAmount: '10000000',
  dstAmount: '9979503',
  dstAmountMin: '9879707',
  srcAmountUsd: '9.99782613',
  dstAmountUsd: '9.97733359',
  userSteps: [
    {
      type: 'TRANSACTION',
      description: 'approve',
      chainKey: 'base',
      chainType: 'EVM',
      signerAddress: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
      transaction: {
        encoded: {
          chainId: 8453,
          data: '0x095ea7b3000000000000000000000000c6868edf1d2a7a8b759856cb8afa333210dfeda60000000000000000000000000000000000000000000000000000000000989680',
          from: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
          to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        },
      },
    },
    {
      type: 'SIGNATURE',
      description: 'bridge',
      chainKey: 'base',
      signerAddress: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
      signature: {
        type: 'EIP712',
        typedData: {
          primaryType: 'Order',
          domain: {
            name: 'Aori',
            version: '0.3.1',
            verifyingContract: '0xc6868edf1d2a7a8b759856cb8afa333210dfeda6',
          },
          types: {
            EIP712Domain: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'version',
                type: 'string',
              },
              {
                name: 'verifyingContract',
                type: 'address',
              },
            ],
            Order: [
              {
                name: 'inputAmount',
                type: 'uint128',
              },
              {
                name: 'outputAmount',
                type: 'uint128',
              },
              {
                name: 'inputToken',
                type: 'address',
              },
              {
                name: 'outputToken',
                type: 'address',
              },
              {
                name: 'startTime',
                type: 'uint32',
              },
              {
                name: 'endTime',
                type: 'uint32',
              },
              {
                name: 'srcEid',
                type: 'uint32',
              },
              {
                name: 'dstEid',
                type: 'uint32',
              },
              {
                name: 'offerer',
                type: 'address',
              },
              {
                name: 'recipient',
                type: 'address',
              },
            ],
          },
          message: {
            offerer: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
            recipient: '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
            inputToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            outputToken: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
            inputAmount: '10000000',
            outputAmount: '9979503',
            startTime: '1791417667',
            endTime: '1791417757',
            srcEid: 30184,
            dstEid: 30110,
          },
        },
      },
    },
  ],
  options: {
    dstNativeDropAmount: '0',
  },
}

export const solanaSteps = valueTransferBuildUserStepsResponseSchema.parse({
  userSteps: [
    {
      type: 'TRANSACTION',
      description: 'bridge',
      chainKey: 'solana',
      chainType: 'SOLANA',
      signerAddress: 'Dz93pUVjXuaMnSsPSn7V99V4cUzhKoQdx9ECwZJZiafG',
      transaction: {
        encoded: {
          encoding: 'base64',
          data: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAFCMDvcyavh3sN3H7mePfsJyGWsA137uo9K+BIiXXaRLBXCvoDMFK9HXOVDe+ER/lrLdj6C7yxS8WdykimJiVoF7DF7hr3LoyUtFX6nk2zUMztS9hJUwRvfewGFnKVUh0eI4yXJY9OJInxuz0QKRSODYMLWhOZ2v8QhASOe9jb6fhZQDbiSyxsOJN309whAuxkStUqsPUjb8TrtNcrZk4Vbe3G+nrzvtutOj1l82qryXQxsbvkwtL24OR8pgIDRS9dYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKl4ORI4waQSSYLr3hCCJwXUDmDxzyzsLOL+YkfuZ9cdrAIDBgABBAUGBwEBBwQCBQEACgyAlpgAAAAAAAYA',
        },
      },
    },
  ],
}).userSteps

export const stellarSteps = valueTransferBuildUserStepsResponseSchema.parse({
  userSteps: [
    {
      type: 'TRANSACTION',
      description: 'bridge',
      chainKey: 'stellar',
      chainType: 'STELLAR',
      signerAddress: 'GDMTVHLWJTHSUDMZVVMXXH6VJHA2ZV3HNG5LYNAZ6RTWB7GISM6PGTUV',
      transaction: {
        encoded: {
          operationsXDR: [
            'AAAAAAAAABgAAAAAAAAAAV1nLLIbOvzdpUVGx/W5/TRpIOQfj+jznoOOXXvXQ1VGAAAABHNlbmQAAAAEAAAAEgAAAAAAAAAA2TqddkzPKg2ZrVl7n9VJwazXZ2m6vDQZ9Gdg/MiTPPMAAAARAAAAAQAAAAcAAAAPAAAACWFtb3VudF9sZAAAAAAAAAoAAAAAAAAAAAAAAAAF9eEAAAAADwAAAAtjb21wb3NlX21zZwAAAAANAAAAAAAAAA8AAAAHZHN0X2VpZAAAAAADAAB1ngAAAA8AAAANZXh0cmFfb3B0aW9ucwAAAAAAAA0AAAACAAMAAAAAAA8AAAANbWluX2Ftb3VudF9sZAAAAAAAAAoAAAAAAAAAAAAAAAAF5p7AAAAADwAAAAdvZnRfY21kAAAAAA0AAAAAAAAADwAAAAJ0bwAAAAAADQAAACAAAAAAAAAAAAAAAAD/ZMLV4j6cSOi0KiPccAVe7J6gmAAAABEAAAABAAAAAgAAAA8AAAAKbmF0aXZlX2ZlZQAAAAAACgAAAAAAAAAAAAAAAABXhrkAAAAPAAAAB3pyb19mZWUAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAADZOp12TM8qDZmtWXuf1UnBrNdnabq8NBn0Z2D8yJM88wAAAAA=',
          ],
          inclusionFee: '200',
        },
      },
    },
  ],
}).userSteps

export const sender = '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098' as const
export const delegate = '0x8EcA03175fd5aC62fb6F4EcbB9A95D13dCDCB4F8' as const
export const wrapper = '0x7e07A9148E9149e430C6412b79A675028595Ff1f' as const
export const metadata = {
  base: {
    deployments: {
      transferDelegate: { address: delegate },
      multicall: { address: wrapper },
    },
  },
}
export function makeExecutionTrade(aori = false) {
  const quote = valueTransferQuoteSchema.parse(
    structuredClone(aori ? aoriFixture : quoteFixture),
  )
  for (const step of quote.userSteps ?? []) {
    if (step.type === 'SIGNATURE')
      step.signature.typedData.message.endTime = String(
        Math.floor(Date.now() / 1000) + 3600,
      )
  }
  const token0 = new EvmToken({
    chainId: 8453,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  })
  const token1 = new EvmToken({
    chainId: 42161,
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  })
  const native = {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  }
  return normalizeValueTransferTrade({
    quote,
    quoteRequest: {
      srcChainKey: 'base',
      dstChainKey: 'arbitrum',
      srcTokenAddress: token0.address,
      dstTokenAddress: token1.address,
      srcWalletAddress: sender,
      dstWalletAddress: sender,
      amount: '10000000',
    },
    srcChain: {
      chainKey: 'base',
      chainId: 8453,
      chainType: 'EVM',
      name: 'Base',
      shortName: 'base',
      nativeCurrency: { ...native, chainKey: 'base' },
    },
    dstChain: {
      chainKey: 'arbitrum',
      chainId: 42161,
      chainType: 'EVM',
      name: 'Arbitrum',
      shortName: 'arb',
      nativeCurrency: { ...native, chainKey: 'arbitrum' },
    },
    token0,
    token1,
    sourceAddress: sender,
    recipient: sender,
  })
}
