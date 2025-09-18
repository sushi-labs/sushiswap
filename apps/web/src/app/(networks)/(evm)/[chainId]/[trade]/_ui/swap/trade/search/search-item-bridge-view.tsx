import { ArrowRightIcon } from '@heroicons/react-v1/solid'
import type { SearchToken } from '@sushiswap/graph-client/data-api'
import { Button, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo, useState } from 'react'
import { useSwapTokenSelect } from 'src/lib/hooks/useTokenSelect'
import { getChainById } from 'sushi'
import type { EvmChainId } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'
import { ChainOptionsSelector } from '../../chain-options-selector'
import { useSearchContext } from './search-provider'

export const SearchItemBridgeView = ({
  token,
  toggleBridgeView,
}: {
  token: SearchToken
  toggleBridgeView: (view: 'open' | 'close') => void
}) => {
  const {
    mutate: { setSearchValue, setIsOpen },
  } = useSearchContext()
  const [selectedNetwork, setSelectedNetwork] = useState<EvmChainId | null>(
    null,
  )
  const { handleTokenOutput } = useSwapTokenSelect()
  const bridgeOptions = useMemo(() => {
    return (
      token?.bridgeInfo?.map((bridge) => bridge.chainId as EvmChainId) ?? []
    )
  }, [token])

  const onNetworkSelect = (chainId: EvmChainId | null) => {
    setSelectedNetwork(chainId)
  }

  const onConfirm = async () => {
    const chainId = selectedNetwork
    if (!chainId) return
    const tokenOnNewChain = token.bridgeInfo?.find(
      (bridge) => bridge.chainId === chainId,
    )
    if (!tokenOnNewChain) {
      console.error('Token not found on the selected chain')
      return
    }
    const _token = new EvmToken({
      chainId: chainId as EvmChainId,
      address: tokenOnNewChain.address,
      decimals: tokenOnNewChain.decimals,
      symbol: token.symbol,
      name: token.name,
    })
    setSearchValue('')
    await handleTokenOutput({
      token: _token,
    })
    toggleBridgeView('close')
    setSelectedNetwork(null)
    setIsOpen(false)
  }

  return (
    <div
      className={classNames(
        'grid col-span-4 grid-cols-[30px_auto_auto_auto] border border-black/5 dark:border-white/5 py-3 px-4 rounded-lg bg-[#4217FF14] dark:bg-[#FFFFFF14]',
      )}
    >
      <div className="flex flex-col w-full col-span-4 gap-4">
        <div className="flex items-end gap-2">
          <div className="flex flex-col items-start justify-between h-full gap-2 pb-1">
            <span className="text-slate-450 dark:text-slate-500 text-[10px]">
              Bridge From
            </span>
            <div className="flex items-center gap-1 font-medium text-muted-foreground">
              <NetworkIcon
                type="square"
                className="rounded-[3px] border border-[#E8E7EB] dark:border-[#222137]"
                chainId={token.chainId as EvmChainId}
                width={16}
                height={16}
              />
              <span className="text-xs">
                {getChainById(token.chainId as EvmChainId)?.name}
              </span>
            </div>
          </div>
          <div className="pb-1 ml-10 mr-3">
            <ArrowRightIcon
              width={16}
              height={16}
              className="text-slate-450 dark:text-slate-500"
            />
          </div>
          <div className="flex flex-col items-start justify-between w-full h-full gap-2">
            <span className="text-slate-450 dark:text-slate-500 text-[10px]">
              Bridge To
            </span>
            <ChainOptionsSelector
              includeAllOption={false}
              selectedNetwork={selectedNetwork}
              onNetworkSelect={onNetworkSelect}
              networks={bridgeOptions}
              networkSelectedClassName="bg-[#4217FF14] dark:!bg-[#FFFFFF14] dark:!border-[#3DB1FF] border-blue"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            className="w-1/2 !bg-[#0000001F] dark:!bg-[#FFFFFF14] hover:!bg-[#00000033] dark:hover:!bg-[#FFFFFF22]"
            size="sm"
            variant="secondary"
            onClick={() => {
              toggleBridgeView('close')
              setSelectedNetwork(null)
            }}
          >
            Cancel
          </Button>
          <Button className="w-full" size="sm" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
