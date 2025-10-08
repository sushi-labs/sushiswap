'use client'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  LinkExternal,
  List,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import {
  type DeprecatedSushiSwapV2ChainId,
  type DeprecatedSushiSwapV3ChainId,
  EvmChainId,
  FEE_COLLECTOR_CHAIN_IDS,
  MULTISIG_ADDRESS,
  PROTOCOL_FEE_COLLECTOR_ADDRESS,
  SURPLUS_FEE_COLLECTOR_ADDRESS,
  SUSHISWAP_V2_FACTORY_ADDRESS,
  SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV2ChainId,
  type SushiSwapV3ChainId,
  UI_FEE_COLLECTOR_ADDRESS,
  isSushiSwapV2ChainId as _isSushiSwapV2ChainId,
  isSushiSwapV3ChainId as _isSushiSwapV3ChainId,
  getEvmChainById,
  isDeprecatedSushiSwapV2ChainId,
  isDeprecatedSushiSwapV3ChainId,
  isMultisigChainId,
  shortenEvmAddress,
  sushiSwapV2FactoryAbi_feeTo,
  sushiSwapV2FactoryAbi_feeToSetter,
  sushiSwapV3FactoryAbi_owner,
} from 'sushi/evm'
import { isAddressEqual, zeroAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { useReadContracts } from 'wagmi'
import {
  feeCollectorAbi,
  makerAbi,
  routeProcessorAbi,
  v3ManagerAbi,
} from './abi'

type FeeCollectorChainId = (typeof FEE_COLLECTOR_CHAIN_IDS)[number]
const isFeeCollectorChainId = (
  chainId: EvmChainId,
): chainId is FeeCollectorChainId =>
  FEE_COLLECTOR_CHAIN_IDS.includes(chainId as FeeCollectorChainId)

const isSushiSwapV2ChainId = (
  chainId: number,
): chainId is SushiSwapV2ChainId | DeprecatedSushiSwapV2ChainId => {
  return (
    _isSushiSwapV2ChainId(chainId) || isDeprecatedSushiSwapV2ChainId(chainId)
  )
}

const isSushiSwapV3ChainId = (
  chainId: number,
): chainId is SushiSwapV3ChainId | DeprecatedSushiSwapV3ChainId => {
  return (
    _isSushiSwapV3ChainId(chainId) ||
    isDeprecatedSushiSwapV3ChainId(chainId as EvmChainId)
  )
}

const V3_MANAGER_CHAIN_IDS = [
  ...SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  EvmChainId.CELO,
  EvmChainId.POLYGON_ZKEVM,
].filter(
  (chainId) => chainId !== EvmChainId.TATARA && chainId !== EvmChainId.SEPOLIA,
)

type V3ManagerChainId = (typeof V3_MANAGER_CHAIN_IDS)[number]

const isV3ManagerChainId = (chainId: EvmChainId): chainId is V3ManagerChainId =>
  V3_MANAGER_CHAIN_IDS.includes(chainId as V3ManagerChainId)

const V3_MANAGER_ADDRESS: Record<V3ManagerChainId, Address> = {
  [EvmChainId.ETHEREUM]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.ARBITRUM_NOVA]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.ARBITRUM]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.AVALANCHE]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.BASE]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.BLAST]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.BOBA]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.BSC]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.BTTC]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.CELO]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.CORE]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.FANTOM]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.FILECOIN]: '0x840ecabCaD4D6B8d25A9bB853ae32eac467E017b',
  // [EvmChainId.FUSE]:	'0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.GNOSIS]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.HAQQ]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.KAVA]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.LINEA]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.METIS]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  // [EvmChainId.MOONBEAM]:	'0xCd03e2e276F6EEdD424d41314437531F665187b9',
  // [EvmChainId.MOONRIVER]:	'0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.OPTIMISM]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.POLYGON]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.POLYGON_ZKEVM]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.ROOTSTOCK]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.SCROLL]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.SKALE_EUROPA]: '0xb865477f91caAA7b156fEA25834F1c5f017a4D1b',
  [EvmChainId.THUNDERCORE]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.ZETACHAIN]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.SONIC]: '0xc707E1FF974E28918b1e4D0cFf5a020450E8aCE7',
  [EvmChainId.HEMI]: '0xc707E1FF974E28918b1e4D0cFf5a020450E8aCE7',
  [EvmChainId.KATANA]: '0xE86d181769f1efb6C30eEFEaFe82790A76B56862',
} as const

const MAKER_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.ARBITRUM,
  EvmChainId.AVALANCHE,
  EvmChainId.BASE,
  EvmChainId.BSC,
  EvmChainId.BTTC,
  EvmChainId.CELO,
  EvmChainId.CORE,
  EvmChainId.FANTOM,
  EvmChainId.HARMONY,
  EvmChainId.GNOSIS,
  EvmChainId.HAQQ,
  EvmChainId.POLYGON,
  EvmChainId.SCROLL,
  EvmChainId.SONIC,
  EvmChainId.KATANA,
] as const

type MakerChainId = (typeof MAKER_CHAIN_IDS)[number]

const isMakerChainId = (chainId: EvmChainId): chainId is MakerChainId =>
  MAKER_CHAIN_IDS.includes(chainId as MakerChainId)

const MAKER_ADDRESS: Record<MakerChainId, Address> = {
  [EvmChainId.ETHEREUM]: '0x5ad6211CD3fdE39A9cECB5df6f380b8263d1e277',
  [EvmChainId.ARBITRUM]: '0xa19b3b22f29E23e4c04678C94CFC3e8f202137d8',
  [EvmChainId.AVALANCHE]: '0x560C759A11cd026405F6f2e19c65Da1181995fA2',
  [EvmChainId.BASE]: '0xa2665dEcd00008a54428c72DC926265a6d2c40CF',
  [EvmChainId.BSC]: '0xe2d7460457f55e4786C69D2d3fa81978Bf8DD11C',
  [EvmChainId.BTTC]: '0xBda8a8423B7F02Cd935412FB9F13CB88f7875991',
  [EvmChainId.CELO]: '0x79eFe1049e8A95f1E11a216DE2DCa27b1E941Bfb',
  [EvmChainId.CORE]: '0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e',
  [EvmChainId.FANTOM]: '0x194D47464DEeaFEF3b599B81e2984306a315D422',
  [EvmChainId.HARMONY]: '0xc4D75E14Fe19Da160d09Cf6203c4F625B42663f3',
  [EvmChainId.GNOSIS]: '0xa974B421d31DB37D6522Abf7783dcBadF39d21D1',
  [EvmChainId.HAQQ]: '0xBda8a8423B7F02Cd935412FB9F13CB88f7875991',
  [EvmChainId.POLYGON]: '0xf1c9881Be22EBF108B8927c4d197d126346b5036',
  [EvmChainId.SCROLL]: '0x039e87AB90205F9d87c5b40d4B28e2Be45dA4a20',
  [EvmChainId.SONIC]: '0x1B7B944fAc5cCe2a1ee8B63BAa47D31bcBe34709',
  [EvmChainId.KATANA]: '0xDA9C0fAA0D15E4525d3854E58dBdF23C67b3477c',
} as const

const ROUTE_PROCESSOR_9_SUPPORTED_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.ARBITRUM,
  EvmChainId.OPTIMISM,
  EvmChainId.BASE,
  EvmChainId.POLYGON,
  EvmChainId.AVALANCHE,
  EvmChainId.BSC,
  EvmChainId.LINEA,
  EvmChainId.ARBITRUM_NOVA,
  EvmChainId.GNOSIS,
  EvmChainId.FANTOM,
  EvmChainId.BTTC,
  EvmChainId.CELO,
  EvmChainId.FILECOIN,
  EvmChainId.HAQQ,
  EvmChainId.KAVA,
  EvmChainId.METIS,
  EvmChainId.THUNDERCORE,
  EvmChainId.SCROLL,
  EvmChainId.ZETACHAIN,
  EvmChainId.POLYGON_ZKEVM,
  EvmChainId.HARMONY,
  EvmChainId.BOBA,
  EvmChainId.BOBA_BNB,
  EvmChainId.CORE,
  EvmChainId.CRONOS,
  EvmChainId.BLAST,
  EvmChainId.SKALE_EUROPA,
  EvmChainId.ROOTSTOCK,
  EvmChainId.ZKSYNC_ERA,
  EvmChainId.MANTLE,
  EvmChainId.MANTA,
  EvmChainId.MODE,
  EvmChainId.TAIKO,
  EvmChainId.ZKLINK,
  EvmChainId.APE,
  EvmChainId.SONIC,
  EvmChainId.HEMI,
  EvmChainId.KATANA,
  EvmChainId.HYPEREVM,
  EvmChainId.BERACHAIN,
  EvmChainId.SEPOLIA,
  EvmChainId.PLASMA,
] as const
type RouteProcessor9ChainId =
  (typeof ROUTE_PROCESSOR_9_SUPPORTED_CHAIN_IDS)[number]
const ROUTE_PROCESSOR_9_ADDRESS: Record<RouteProcessor9ChainId, Address> = {
  [EvmChainId.ETHEREUM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ARBITRUM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.OPTIMISM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BASE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.POLYGON]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.AVALANCHE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BSC]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.LINEA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ARBITRUM_NOVA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.GNOSIS]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.FANTOM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BTTC]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.CELO]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.FILECOIN]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.HAQQ]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.KAVA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.METIS]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.THUNDERCORE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.SCROLL]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ZETACHAIN]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.POLYGON_ZKEVM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.HARMONY]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BOBA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BOBA_BNB]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.CORE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.CRONOS]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BLAST]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.SKALE_EUROPA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ROOTSTOCK]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ZKSYNC_ERA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.MANTLE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.MANTA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.MODE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.TAIKO]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.ZKLINK]: '0xe0a091ceeb255ce3abc3b18305d48a07521e19e1',
  [EvmChainId.APE]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.SONIC]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.HEMI]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.KATANA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.HYPEREVM]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.BERACHAIN]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.SEPOLIA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
  [EvmChainId.PLASMA]: '0xd2b37ade14708bf18904047b1e31f8166d39612b',
} as const
const isRouteProcessor9ChainId = (
  chainId: number,
): chainId is RouteProcessor9ChainId =>
  ROUTE_PROCESSOR_9_SUPPORTED_CHAIN_IDS.includes(
    chainId as RouteProcessor9ChainId,
  )

const LIQUIDATOR_BOT_ADDRESS = '0xb6B1581b3d267044761156d55717b719aB0565B1'

const labelWallet = (address: Address, chainId: EvmChainId) => {
  if (isMultisigChainId(chainId)) {
    if (isAddressEqual(address, MULTISIG_ADDRESS[chainId])) return 'OPS MSIG'
  }
  if (isFeeCollectorChainId(chainId)) {
    if (isAddressEqual(address, UI_FEE_COLLECTOR_ADDRESS[chainId]))
      return 'UI FEE COLLECTOR'
    if (isAddressEqual(address, SURPLUS_FEE_COLLECTOR_ADDRESS[chainId]))
      return 'SURPLUS FEE COLLECTOR'
    if (isAddressEqual(address, PROTOCOL_FEE_COLLECTOR_ADDRESS[chainId]))
      return 'PROTOCOL FEE COLLECTOR'
  }
  if (isAddressEqual(address, LIQUIDATOR_BOT_ADDRESS)) return 'LIQUIDATOR BOT'
  if (isV3ManagerChainId(chainId)) {
    if (isAddressEqual(address, V3_MANAGER_ADDRESS[chainId]))
      return 'V3 MANAGER'
  }
  if (isMakerChainId(chainId)) {
    if (isAddressEqual(address, MAKER_ADDRESS[chainId])) {
      if (chainId === EvmChainId.ETHEREUM) {
        return 'SUSHI MAKER'
      } else {
        return 'WETH MAKER'
      }
    }
  }
  if (isAddressEqual(address, zeroAddress))
    return shortenEvmAddress(zeroAddress)

  return undefined
}

type V3ManagerInfo = {
  owner?: Address
  pendingOwner?: Address
  maker?: Address
  trusted?: Address
}

type FeeCollectorInfo = {
  owner?: Address
  pendingOwner?: Address
  trusted?: Address
}

type V2FactoryInfo = {
  feeTo?: Address
  feeToSetter?: Address
}

type V3FactoryInfo = {
  owner?: Address
}

type MakerInfo = {
  owner?: Address
  trusted?: Address
}

type RouteProcessorInfo = {
  owner?: Address
}

const NetworkInfo = ({ chainId }: { chainId: EvmChainId }) => {
  const contractEntries = useMemo(() => {
    return [
      ...(isV3ManagerChainId(chainId)
        ? ([
            {
              scope: 'v3Manager',
              contract: {
                chainId,
                abi: v3ManagerAbi,
                address: V3_MANAGER_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
            {
              scope: 'v3Manager',
              contract: {
                chainId,
                abi: v3ManagerAbi,
                address: V3_MANAGER_ADDRESS[chainId],
                functionName: 'pendingOwner',
              },
            },
            {
              scope: 'v3Manager',
              contract: {
                chainId,
                abi: v3ManagerAbi,
                address: V3_MANAGER_ADDRESS[chainId],
                functionName: 'maker',
              },
            },
            {
              scope: 'v3Manager',
              contract: {
                chainId,
                abi: v3ManagerAbi,
                address: V3_MANAGER_ADDRESS[chainId],
                functionName: 'trusted',
                args: [LIQUIDATOR_BOT_ADDRESS],
              },
            },
          ] as const)
        : []),
      ...(isFeeCollectorChainId(chainId)
        ? ([
            {
              scope: 'uiFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: UI_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
            {
              scope: 'uiFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: UI_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'pendingOwner',
              },
            },
            {
              scope: 'uiFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: UI_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'trusted',
                args: [LIQUIDATOR_BOT_ADDRESS],
              },
            },
            {
              scope: 'surplusFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: SURPLUS_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
            {
              scope: 'surplusFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: SURPLUS_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'pendingOwner',
              },
            },
            {
              scope: 'surplusFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: SURPLUS_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'trusted',
                args: [LIQUIDATOR_BOT_ADDRESS],
              },
            },
            {
              scope: 'protocolFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: PROTOCOL_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
            {
              scope: 'protocolFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: PROTOCOL_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'pendingOwner',
              },
            },
            {
              scope: 'protocolFeeCollector',
              contract: {
                chainId,
                abi: feeCollectorAbi,
                address: PROTOCOL_FEE_COLLECTOR_ADDRESS[chainId],
                functionName: 'trusted',
                args: [LIQUIDATOR_BOT_ADDRESS],
              },
            },
          ] as const)
        : []),
      ...(isSushiSwapV2ChainId(chainId)
        ? ([
            {
              scope: 'v2Factory',
              contract: {
                chainId,
                abi: sushiSwapV2FactoryAbi_feeTo,
                address: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
                functionName: 'feeTo',
              },
            },
            {
              scope: 'v2Factory',
              contract: {
                chainId,
                abi: sushiSwapV2FactoryAbi_feeToSetter,
                address: SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
                functionName: 'feeToSetter',
              },
            },
          ] as const)
        : []),
      ...(isSushiSwapV3ChainId(chainId)
        ? ([
            {
              scope: 'v3Factory',
              contract: {
                chainId,
                abi: sushiSwapV3FactoryAbi_owner,
                address: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
          ] as const)
        : []),
      ...(isMakerChainId(chainId)
        ? ([
            {
              scope: 'maker',
              contract: {
                chainId,
                abi: makerAbi,
                address: MAKER_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
            {
              scope: 'maker',
              contract: {
                chainId,
                abi: makerAbi,
                address: MAKER_ADDRESS[chainId],
                functionName: 'trusted',
                args: [LIQUIDATOR_BOT_ADDRESS],
              },
            },
          ] as const)
        : []),
      ...(isRouteProcessor9ChainId(chainId)
        ? ([
            {
              scope: 'routeProcessor',
              contract: {
                chainId,
                abi: routeProcessorAbi,
                address: ROUTE_PROCESSOR_9_ADDRESS[chainId],
                functionName: 'owner',
              },
            },
          ] as const)
        : []),
    ]
  }, [chainId])

  const { data, isLoading, isError } = useReadContracts({
    contracts: contractEntries.map((entry) => entry.contract),
  })

  const {
    v2Factory,
    v3Factory,
    v3Manager,
    uiFeeCollector,
    surplusFeeCollector,
    protocolFeeCollector,
    maker,
    routeProcessor,
  } = useMemo(() => {
    const initial = {
      v2Factory: undefined as V2FactoryInfo | undefined,
      v3Factory: undefined as V3FactoryInfo | undefined,
      v3Manager: undefined as V3ManagerInfo | undefined,
      uiFeeCollector: undefined as FeeCollectorInfo | undefined,
      surplusFeeCollector: undefined as FeeCollectorInfo | undefined,
      protocolFeeCollector: undefined as FeeCollectorInfo | undefined,
      maker: undefined as MakerInfo | undefined,
      routeProcessor: undefined as RouteProcessorInfo | undefined,
    }

    const results = data
    if (!results) return initial

    return contractEntries.reduce<typeof initial>((acc, entry, index) => {
      const _value = data[index]?.result

      let value = _value
      if (entry.contract.functionName === 'trusted') {
        if (value === true) {
          value = entry.contract.args[0]
        } else {
          value = undefined
        }
      }

      if (typeof value === 'undefined') return acc

      acc[entry.scope] = {
        ...(acc[entry.scope] ?? {}),
        [entry.contract.functionName]: value,
      }

      return acc
    }, initial)
  }, [contractEntries, data])

  const renderAccount = (address: Address | undefined) => {
    if (!address) {
      return <span className="text-xs text-muted-foreground">Not set</span>
    }

    const label = labelWallet(address, chainId)
    return (
      <LinkExternal href={getEvmChainById(chainId).getAccountUrl(address)}>
        {label ? (
          <span className="text-xs text-muted-foreground">{label}</span>
        ) : (
          <span className="text-xs">{shortenEvmAddress(address)}</span>
        )}
      </LinkExternal>
    )
  }

  return (
    <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
      <Card>
        <CardHeader>
          <CardTitle>
            {isFeeCollectorChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  UI_FEE_COLLECTOR_ADDRESS[chainId],
                )}
              >
                UI Fee Collector
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">UI Fee Collector</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isFeeCollectorChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not available for this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(uiFeeCollector?.owner)}
                </List.KeyValue>
                <List.KeyValue title="Pending Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(uiFeeCollector?.pendingOwner)}
                </List.KeyValue>
                <List.KeyValue title="Operator">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(uiFeeCollector?.trusted)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isFeeCollectorChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  SURPLUS_FEE_COLLECTOR_ADDRESS[chainId],
                )}
              >
                Surplus Fee Collector
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">
                Surplus Fee Collector
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isFeeCollectorChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not available for this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(surplusFeeCollector?.owner)}
                </List.KeyValue>
                <List.KeyValue title="Pending Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(surplusFeeCollector?.pendingOwner)}
                </List.KeyValue>
                <List.KeyValue title="Operator">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(surplusFeeCollector?.trusted)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isFeeCollectorChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  PROTOCOL_FEE_COLLECTOR_ADDRESS[chainId],
                )}
              >
                Protocol Fee Collector
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">
                Protocol Fee Collector
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isFeeCollectorChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not available for this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(protocolFeeCollector?.owner)}
                </List.KeyValue>
                <List.KeyValue title="Pending Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(protocolFeeCollector?.pendingOwner)}
                </List.KeyValue>
                <List.KeyValue title="Operator">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(protocolFeeCollector?.trusted)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isRouteProcessor9ChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  ROUTE_PROCESSOR_9_ADDRESS[chainId],
                )}
              >
                RouteProcessor9_2
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">RouteProcessor9_2</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isRouteProcessor9ChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not deployed on this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(routeProcessor?.owner)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isSushiSwapV2ChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  SUSHISWAP_V2_FACTORY_ADDRESS[chainId],
                )}
              >
                V2Factory
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">V2Factory</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isSushiSwapV2ChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not deployed on this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Fee To">
                  {isLoading ? 'Loading…' : renderAccount(v2Factory?.feeTo)}
                </List.KeyValue>
                <List.KeyValue title="Fee To Setter">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(v2Factory?.feeToSetter)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isMakerChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  MAKER_ADDRESS[chainId],
                )}
              >
                {chainId === EvmChainId.ETHEREUM ? 'SushiMaker' : 'WETHMaker'}
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">{'WETHMaker'}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isMakerChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not deployed on this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading ? 'Loading…' : renderAccount(maker?.owner)}
                </List.KeyValue>
                <List.KeyValue title="Operator">
                  {isLoading ? 'Loading…' : renderAccount(maker?.trusted)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isSushiSwapV3ChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
                )}
              >
                V3Factory
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">V3Factory</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isSushiSwapV3ChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not deployed on this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading ? 'Loading…' : renderAccount(v3Factory?.owner)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {isV3ManagerChainId(chainId) ? (
              <LinkExternal
                href={getEvmChainById(chainId).getAccountUrl(
                  V3_MANAGER_ADDRESS[chainId],
                )}
              >
                V3Manager
              </LinkExternal>
            ) : (
              <span className="text-muted-foreground">V3Manager</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isV3ManagerChainId(chainId) ? (
            <span className="text-sm text-muted-foreground">
              Not deployed on this network.
            </span>
          ) : isError ? (
            <span className="text-sm text-red-500">
              Unable to load contract data.
            </span>
          ) : (
            <List>
              <List.Control>
                <List.KeyValue title="Owner">
                  {isLoading ? 'Loading…' : renderAccount(v3Manager?.owner)}
                </List.KeyValue>
                <List.KeyValue title="Pending Owner">
                  {isLoading
                    ? 'Loading…'
                    : renderAccount(v3Manager?.pendingOwner)}
                </List.KeyValue>
                <List.KeyValue flex title="Maker">
                  {isLoading ? 'Loading…' : renderAccount(v3Manager?.maker)}
                </List.KeyValue>
                <List.KeyValue title="Operator">
                  {isLoading ? 'Loading…' : renderAccount(v3Manager?.trusted)}
                </List.KeyValue>
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const CHAINS = Array.from(
  new Set(
    [
      ...V3_MANAGER_CHAIN_IDS,
      ...FEE_COLLECTOR_CHAIN_IDS,
      ...SUSHISWAP_V2_SUPPORTED_CHAIN_IDS,
      ...SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
    ].filter(
      (chainId) =>
        ![EvmChainId.SEPOLIA, EvmChainId.TATARA].includes(chainId as any),
    ),
  ),
) as EvmChainId[]

export default function Page() {
  return (
    <Container maxWidth="5xl" className="px-2 sm:px-4">
      <div className="flex flex-col gap-5">
        {CHAINS.map((chainId) => {
          return (
            <div key={chainId} className="flex flex-col gap-1">
              <span>{getEvmChainById(chainId).name}</span>
              <NetworkInfo chainId={chainId} />
            </div>
          )
        })}
      </div>
    </Container>
  )
}
