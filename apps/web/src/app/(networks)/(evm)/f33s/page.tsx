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
  EvmChainId,
  FEE_COLLECTOR_CHAIN_IDS,
  MULTISIG_ADDRESS,
  PROTOCOL_FEE_COLLECTOR_ADDRESS,
  SURPLUS_FEE_COLLECTOR_ADDRESS,
  UI_FEE_COLLECTOR_ADDRESS,
  getEvmChainById,
  isMultisigChainId,
  isSurplusFeeCollectorChainId,
  shortenEvmAddress,
} from 'sushi/evm'
import { isAddressEqual, zeroAddress } from 'viem'
import type { Address } from 'viem/accounts'
import { type UseReadContractsParameters, useReadContracts } from 'wagmi'
import { feeCollectorAbi } from './fee-collector-abi'
import { abi as v3ManagerAbi } from './v3-manager-abi'

type FeeCollectorChainId = (typeof FEE_COLLECTOR_CHAIN_IDS)[number]
const isFeeCollectorChainId = (
  chainId: EvmChainId,
): chainId is FeeCollectorChainId =>
  FEE_COLLECTOR_CHAIN_IDS.includes(chainId as FeeCollectorChainId)

const V3_MANAGER_CHAIN_IDS = [
  EvmChainId.ETHEREUM,
  EvmChainId.ARBITRUM_NOVA,
  EvmChainId.ARBITRUM,
  EvmChainId.AVALANCHE,
  EvmChainId.BASE,
  EvmChainId.BLAST,
  EvmChainId.BOBA,
  EvmChainId.BSC,
  EvmChainId.BTTC,
  EvmChainId.CELO,
  EvmChainId.CORE,
  EvmChainId.FANTOM,
  EvmChainId.FILECOIN,
  // EvmChainId.FUSE,
  EvmChainId.GNOSIS,
  EvmChainId.HAQQ,
  EvmChainId.KAVA,
  EvmChainId.LINEA,
  EvmChainId.METIS,
  // EvmChainId.MOONBEAM,
  // EvmChainId.MOONRIVER,
  EvmChainId.OPTIMISM,
  EvmChainId.POLYGON,
  EvmChainId.POLYGON_ZKEVM,
  EvmChainId.ROOTSTOCK,
  EvmChainId.SCROLL,
  // EvmChainId.SKALE_EUROPA,
  EvmChainId.THUNDERCORE,
  EvmChainId.ZETACHAIN,
  EvmChainId.SONIC,
  EvmChainId.HEMI,
  EvmChainId.KATANA,
] as const

type V3ManagerChainId = (typeof V3_MANAGER_CHAIN_IDS)[number]

const isV3ManagerChainId = (chainId: EvmChainId): chainId is V3ManagerChainId =>
  V3_MANAGER_CHAIN_IDS.includes(chainId as V3ManagerChainId)

const V3_MANAGER_ADDRESS: Record<V3ManagerChainId, `0x${string}`> = {
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
  // [EvmChainId.SKALE_EUROPA]: //
  [EvmChainId.THUNDERCORE]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.ZETACHAIN]: '0xCd03e2e276F6EEdD424d41314437531F665187b9',
  [EvmChainId.SONIC]: '0xc707E1FF974E28918b1e4D0cFf5a020450E8aCE7',
  [EvmChainId.HEMI]: '0xc707E1FF974E28918b1e4D0cFf5a020450E8aCE7',
  [EvmChainId.KATANA]: '0xE86d181769f1efb6C30eEFEaFe82790A76B56862',
} as const

const UI_FEE_COLLECTOR_BOT_ADDRESS =
  '0xb6B1581b3d267044761156d55717b719aB0565B1'

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
  if (isAddressEqual(address, UI_FEE_COLLECTOR_BOT_ADDRESS)) return 'UI FEE BOT'
  if (isAddressEqual(address, zeroAddress))
    return shortenEvmAddress(zeroAddress)

  return undefined
}

type V3ManagerInfo = {
  owner?: Address
  pendingOwner?: Address
  maker?: Address
  trusted?: Address // TODO: array
}

type FeeCollectorInfo = {
  owner?: Address
  pendingOwner?: Address
  trusted?: Address // TODO: array
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
                args: [UI_FEE_COLLECTOR_BOT_ADDRESS],
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
                functionName: 'trusted',
                args: [UI_FEE_COLLECTOR_BOT_ADDRESS],
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
          ] as const)
        : []),
    ]
  }, [chainId])

  const { data, isLoading, isError } = useReadContracts({
    contracts: contractEntries.map((entry) => entry.contract),
  })

  const {
    v3Manager,
    uiFeeCollector,
    surplusFeeCollector,
    protocolFeeCollector,
  } = useMemo(() => {
    const initial = {
      v3Manager: undefined as V3ManagerInfo | undefined,
      uiFeeCollector: undefined as FeeCollectorInfo | undefined,
      surplusFeeCollector: undefined as FeeCollectorInfo | undefined,
      protocolFeeCollector: undefined as FeeCollectorInfo | undefined,
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
    <div className="grid grid-cols-3 gap-2">
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
                <List.KeyValue title="Maker">
                  {isLoading ? 'Loading…' : renderAccount(v3Manager?.maker)}
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
              </List.Control>
            </List>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const CHAINS = Array.from(
  new Set([...V3_MANAGER_CHAIN_IDS, ...FEE_COLLECTOR_CHAIN_IDS]),
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
