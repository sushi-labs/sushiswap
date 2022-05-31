import { Contract } from '@ethersproject/contracts'
import {
  BAR_ADDRESS,
  BENTOBOX_ADDRESS,
  BORING_HELPER_ADDRESS,
  CHAIN_KEY,
  ChainId,
  CHAINLINK_ORACLE_ADDRESS,
  ENS_REGISTRAR_ADDRESS,
  FACTORY_ADDRESS,
  MAKER_ADDRESS,
  MASTERCHEF_ADDRESS,
  MASTERCHEF_V2_ADDRESS,
  MERKLE_DISTRIBUTOR_ADDRESS,
  MINICHEF_ADDRESS,
  MULTICALL2_ADDRESS,
  ROUTER_ADDRESS,
  SUSHI_ADDRESS,
  TIMELOCK_ADDRESS,
  WNATIVE_ADDRESS,
} from '@sushiswap/core-sdk'
import { LIMIT_ORDER_HELPER_ADDRESS, STOP_LIMIT_ORDER_ADDRESS } from '@sushiswap/limit-order-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import ConstantProductPoolArtifact from '@sushiswap/trident/artifacts/contracts/pool/constant-product/ConstantProductPool.sol/ConstantProductPool.json'
import TRIDENT from '@sushiswap/trident/exports/all.json'
import { Pool, PoolType } from '@sushiswap/trident-sdk'
import { OLD_FARMS } from 'app/config/farms'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from 'app/constants/abis/argent-wallet-detector'
import BAR_ABI from 'app/constants/abis/bar.json'
import BENTOBOX_ABI from 'app/constants/abis/bentobox.json'
import BORING_HELPER_ABI from 'app/constants/abis/boring-helper.json'
import CHAINLINK_ORACLE_ABI from 'app/constants/abis/chainlink-oracle.json'
import CLONE_REWARDER_ABI from 'app/constants/abis/clone-rewarder.json'
import COMPLEX_REWARDER_ABI from 'app/constants/abis/complex-rewarder.json'
import DASHBOARD_ABI from 'app/constants/abis/dashboard.json'
import EIP_2612_ABI from 'app/constants/abis/eip-2612.json'
import ENS_PUBLIC_RESOLVER_ABI from 'app/constants/abis/ens-public-resolver.json'
import ENS_ABI from 'app/constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI } from 'app/constants/abis/erc20'
import ERC20_ABI from 'app/constants/abis/erc20.json'
import FACTORY_ABI from 'app/constants/abis/factory.json'
import INARI_ABI from 'app/constants/abis/inari.json'
import MULTICALL_ABI from 'app/constants/abis/interface-multicall.json'
import KASHI_REPOSITORY_ABI from 'app/constants/abis/kashi-repository.json'
import LIMIT_ORDER_ABI from 'app/constants/abis/limit-order.json'
import LIMIT_ORDER_HELPER_ABI from 'app/constants/abis/limit-order-helper.json'
import MAKER_ABI from 'app/constants/abis/maker.json'
import MASTERCHEF_ABI from 'app/constants/abis/masterchef.json'
import MASTERCHEF_V2_ABI from 'app/constants/abis/masterchef-v2.json'
import MEOWSHI_ABI from 'app/constants/abis/meowshi.json'
import MERKLE_DISTRIBUTOR_ABI from 'app/constants/abis/merkle-distributor.json'
import MINICHEF_ABI from 'app/constants/abis/minichef-v2.json'
import MISO_HELPER_ABI from 'app/constants/abis/miso-helper.json'
import MULTICALL2_ABI from 'app/constants/abis/multicall2.json'
import ROUTER_ABI from 'app/constants/abis/router.json'
import SUSHI_ABI from 'app/constants/abis/sushi.json'
import SUSHIROLL_ABI from 'app/constants/abis/sushi-roll.json'
import TIMELOCK_ABI from 'app/constants/abis/timelock.json'
import UNI_FACTORY_ABI from 'app/constants/abis/uniswap-v2-factory.json'
import IUniswapV2PairABI from 'app/constants/abis/uniswap-v2-pair.json'
import WETH9_ABI from 'app/constants/abis/weth.json'
import ZENKO_ABI from 'app/constants/abis/zenko.json'
import LPToken from 'app/features/migration/LPToken'
import { poolEntityMapper } from 'app/features/trident/poolEntityMapper'
import { getContract } from 'app/functions'
import { useActiveWeb3React } from 'app/services/web3'
import { useMemo } from 'react'

const UNI_FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612_ABI, false)
}

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETH9Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WNATIVE_ADDRESS[chainId] : undefined, WETH9_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.ETHEREUM ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? ENS_REGISTRAR_ADDRESS[chainId] : undefined, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useProtocolMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? '0x1026cbed7b7E851426b959BC69dcC1bf5876512d' : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useKashiRepositoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? '0x400AFAbFB249210E08A8dfC429FfE20d32245f57' : undefined, KASHI_REPOSITORY_ABI, false)
}

export function useBoringHelperContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  // TODO ramin update in sdk
  return useContract(
    chainId
      ? chainId === ChainId.KOVAN
        ? '0x5bd6e4eFA335192FDA5D6B42a344ccA3d45894B8'
        : BORING_HELPER_ADDRESS[chainId]
      : undefined,
    BORING_HELPER_ABI,
    false
  )
}

export function useMulticall2Contract() {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MULTICALL2_ADDRESS[chainId] : undefined, MULTICALL2_ABI, false)
}

const MULTICALL_ADDRESS = {
  [ChainId.ETHEREUM]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.ROPSTEN]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.RINKEBY]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.GÖRLI]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.KOVAN]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.MATIC]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.MATIC_TESTNET]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.OPTIMISM]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.ARBITRUM]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',
  [ChainId.MOONBEAM]: '0x34c471ddceb20018bbb73f6d13709936fc870acc',
  [ChainId.AVALANCHE]: '0x8C0F842791F03C095b6c633759224FcC9ACe68ea',
  [ChainId.BSC]: '0x47A307e3167820daf22a377D777371753758f59c',
  [ChainId.FANTOM]: '0xB1395e098c0a847CC719Bcf1Fc8114421a9F8232',
  [ChainId.CELO]: '0x3d0B3b816DC1e0825808F27510eF7Aa5E3136D75',
  [ChainId.HARMONY]: '0xaAB49386BFcB605F853763Ea382B91C9c83b9Ac5',
  [ChainId.MOONRIVER]: '0x8C8BF5Dea280A1eC68219D66E8A21E60585830F5',
  [ChainId.XDAI]: '0x2B75358D07417D4e895c952Ca84A44E63AEBE3Dd',
  [ChainId.TELOS]: '0x64e1E895866B3126f8f2E2912B475FDB35b2F315',
  [ChainId.FUSE]: '0x393B6DC9B00E18314888678721eC0e923FC5f49D',
  [ChainId.OKEX]: '0x8C8BF5Dea280A1eC68219D66E8A21E60585830F5',
  [ChainId.HECO]: '0x64e1E895866B3126f8f2E2912B475FDB35b2F315',
  [ChainId.PALM]: '0x4d4A0D45a98AE8EC25b359D93A088A87BC9eF70b',
}

export function useInterfaceMulticall(): Contract | null | undefined {
  return useContract(MULTICALL_ADDRESS, MULTICALL_ABI, false)
}

export function useSushiContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? SUSHI_ADDRESS[chainId] : undefined, SUSHI_ABI, withSignerIfPossible)
}

export function useMasterChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MASTERCHEF_ADDRESS[chainId] : undefined, MASTERCHEF_ABI, withSignerIfPossible)
}

export function useMasterChefV2Contract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MASTERCHEF_V2_ADDRESS[chainId] : undefined, MASTERCHEF_V2_ABI, withSignerIfPossible)
}
export function useMiniChefContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MINICHEF_ADDRESS[chainId] : undefined, MINICHEF_ABI, withSignerIfPossible)
}

export function useFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? FACTORY_ADDRESS[chainId] : undefined, FACTORY_ABI, false)
}

export function useRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  return useContract(ROUTER_ADDRESS[chainId], ROUTER_ABI, withSignerIfPossible)
}

export function useSushiBarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? BAR_ADDRESS[chainId] : undefined, BAR_ABI, withSignerIfPossible)
}

export function useMakerContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MAKER_ADDRESS[chainId] : undefined, MAKER_ABI, false)
}

export function useTimelockContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? TIMELOCK_ADDRESS[chainId] : undefined, TIMELOCK_ABI, false)
}

export function useBentoBoxContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? BENTOBOX_ADDRESS[chainId] : undefined, BENTOBOX_ABI, withSignerIfPossible)
}

export function useChainlinkOracle(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? CHAINLINK_ORACLE_ADDRESS[chainId] : undefined, CHAINLINK_ORACLE_ABI, false)
}

export function useUniV2FactoryContract(): Contract | null {
  return useContract(UNI_FACTORY_ADDRESS, UNI_FACTORY_ABI, false)
}

// @ts-ignore TYPE NEEDS FIXING
export function useComplexRewarderContract(address, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, COMPLEX_REWARDER_ABI, withSignerIfPossible)
}

// @ts-ignore TYPE NEEDS FIXING
export function useCloneRewarderContract(address, withSignerIfPossibe?: boolean): Contract | null {
  return useContract(address, CLONE_REWARDER_ABI, withSignerIfPossibe)
}

export function useMeowshiContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x650F44eD6F1FE0E1417cb4b3115d52494B4D9b6D', MEOWSHI_ABI, withSignerIfPossible)
}

export function useLimitOrderContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? STOP_LIMIT_ORDER_ADDRESS[chainId] : undefined, LIMIT_ORDER_ABI, withSignerIfPossibe)
}

export function useLimitOrderHelperContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId ? LIMIT_ORDER_HELPER_ADDRESS[chainId] : undefined,
    LIMIT_ORDER_HELPER_ABI,
    withSignerIfPossible
  )
}

export function useInariContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0x195E8262AA81Ba560478EC6Ca4dA73745547073f', INARI_ABI, withSignerIfPossible)
}

export function useZenkoContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract('0xa8f676c49f91655ab3b7c3ea2b73bb3088b2bc1f', ZENKO_ABI, withSignerIfPossible)
}

export function useTridentMigrationContract() {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId ? (TRIDENT as any)[chainId][0].contracts.TridentSushiRollCP.address : undefined,
    chainId ? (TRIDENT as any)[chainId][0].contracts.TridentSushiRollCP.abi : undefined
  )
}

export function useTridentPoolContract(pool?: Pool, withSignerIfPossible?: boolean) {
  let artifact
  if (pool && poolEntityMapper(pool) === PoolType.ConstantProduct) artifact = ConstantProductPoolArtifact
  if (pool && poolEntityMapper(pool) !== PoolType.ConstantProduct) {
    throw new Error('Implement new pool type')
  }

  return useContract(pool?.liquidityToken.address ?? undefined, artifact?.abi, withSignerIfPossible)
}

export function useTridentRouterContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const router = TRIDENT[chainId]?.[0]?.contracts.TridentRouter
  return useContract(router?.address, router?.abi, withSignerIfPossible)
}

export function useMasterDeployerContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const masterDeployer = TRIDENT[chainId]?.[0]?.contracts.MasterDeployer
  return useContract(masterDeployer?.address, masterDeployer?.abi, withSignerIfPossible)
}

export function useConstantProductPoolFactory(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const factory = TRIDENT[chainId]?.[0]?.contracts.ConstantProductPoolFactory
  return useContract(factory?.address, factory?.abi, withSignerIfPossible)
}

export function useStablePoolFactory(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const factory = TRIDENT[chainId]?.[0]?.contracts.HybridPoolFactory
  return useContract(factory?.address, factory?.abi, withSignerIfPossible)
}

export function useMisoHelperContract(withSignerIfPossible = true): Contract | null {
  const { chainId } = useActiveWeb3React()
  // @ts-ignore TYPE NEEDS FIXING
  const factory = MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOHelper
  return useContract(factory?.address, MISO_HELPER_ABI, withSignerIfPossible)
}

export function useSushiRollContract(dex: LPToken['dex']): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        if (dex === 'uniswap_v2') {
          address = '0x16E58463eb9792Bc236d8860F5BC69A81E26E32B'
        }

        break
      case ChainId.ROPSTEN:
        address = '0xCaAbdD9Cf4b61813D4a52f980d6BC1B713FE66F5'
        break
      case ChainId.BSC:
        if (dex === 'pancakeswap_v2') {
          address = '0x2DD1aB1956BeD7C2d938d0d7378C22Fd01135a5e'
        }
        break
      case ChainId.MATIC:
        if (dex === 'quickswap') {
          address = '0x0053957E18A0994D3526Cf879A4cA7Be88e8936A'
        }
        break
      case ChainId.FANTOM:
        if (dex === 'spiritswap') {
          address = '0x2D2ed6871f473Fb9f8958F67C2302360A79fd071'
        } else if (dex === 'spookyswap') {
          address = '0xFB232C6D1E3ad48fEdF8A29c7dEf7A33ce43E56a'
        }
        break
      case ChainId.AVALANCHE:
        if (dex === 'traderjoe') {
          address = '0x22a2fBd8bd1123bC3307554AD00bBFF4EDAbB1d5'
        } else if (dex === 'pangolin') {
          address = '0x34F1cC395BeE698d070f33C1c0f8EC4C1022bcFc'
        }

      case ChainId.MOONBEAM:
        if (dex === 'stellaswap') {
          address = '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3'
        } else if (dex === 'beamswap') {
          address = '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287'
        }
      // Spookyswap
      // 0xFB232C6D1E3ad48fEdF8A29c7dEf7A33ce43E56a
    }
  }
  return useContract(address, SUSHIROLL_ABI, true)
}

export function useDashboardContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.ETHEREUM:
        address = '0xD132Ce8eA8865348Ac25E416d95ab1Ba84D216AF'
        break
      case ChainId.ROPSTEN:
        address = '0xC95678C10CB8b3305b694FF4bfC14CDB8aD3AB35'
        break
      case ChainId.BSC:
        address = '0xCFbc963f223e39727e7d4075b759E97035457b48'
        break
    }
  }
  return useContract(address, DASHBOARD_ABI, false)
}

export function useQuickSwapFactoryContract(): Contract | null {
  return useContract('0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', FACTORY_ABI, false)
}

export function useOldFarmsContract(withSignerIfPossibe?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? OLD_FARMS[chainId] : undefined, MINICHEF_ABI, withSignerIfPossibe)
}
