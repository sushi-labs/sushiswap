import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/solid'
import { useCopyClipboard } from '@sushiswap/hooks'
import {
  Button,
  IconButton,
  LinkExternal,
  SkeletonText,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useDepositAddress, useHUEstimateFees } from 'src/lib/perps'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { formatUSD } from 'sushi'
import { EvmChainId, EvmToken, WAVAX, WBTC, WETH9 } from 'sushi/evm'
import { SvmChainId, WSOL } from 'sushi/svm'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { PerpsCard } from '../../_common'
import type { HyperunitDepositOption } from './deposit-dialog'

const ChainToToken = {
  bitcoin: WBTC[EvmChainId.ETHEREUM],
  ethereum: WETH9[EvmChainId.ETHEREUM],
  avalanche: new EvmToken({
    chainId: EvmChainId.AVALANCHE,
    address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    decimals: 18,
    symbol: 'WAVAX',
    name: 'Wrapped AVAX',
  }),
  solana: WSOL[SvmChainId.SOLANA],
  monad: new EvmToken({
    chainId: EvmChainId.MONAD,
    address: '0x3bd359c1119da7da1d913d1c4d2b7c461115433a',
    decimals: 18,
    symbol: 'WMONAD',
    name: 'Wrapped MONAD',
  }),
  base: WETH9[EvmChainId.ETHEREUM],
  plasma: new EvmToken({
    chainId: EvmChainId.PLASMA,
    address: '0x6100e367285b01f48d07953803a2d8dca5d19873',
    decimals: 18,
    symbol: 'WPLASMA',
    name: 'Wrapped PLASMA',
  }),
  zcash: new EvmToken({
    chainId: EvmChainId.ETHEREUM,
    address: '0x4A64515E5E1d1073e83f30cB97BEd20400b66E10',
    decimals: 18,
    symbol: 'ZEC',
    name: 'Zcash',
  }),
}

export const HyperunitOptions = ({
  depositOption,
  setOpen,
}: {
  depositOption: HyperunitDepositOption
  setOpen: (open: boolean) => void
}) => {
  const [isCopied, staticCopy] = useCopyClipboard()
  const { data: _estimateData, isLoading: isLoadingEstimates } =
    useHUEstimateFees()
  const { data: networkTokenPrice } = usePrice({
    chainId: ChainToToken[depositOption.chainName].chainId,
    address: ChainToToken[depositOption.chainName].address,
  })
  const address = useAccount('evm')
  const { data: depositData, isLoading: isLoadingDepositData } =
    useDepositAddress({
      address,
      chainName: depositOption.chainName,
      token: depositOption.token,
    })
  const estimateData = useMemo(() => {
    if (isLoadingEstimates || !_estimateData) {
      return null
    }
    return _estimateData[depositOption.tokenType]
  }, [_estimateData, isLoadingEstimates, depositOption.tokenType])
  const eta = useMemo(
    () =>
      String(estimateData?.[`${depositOption.tokenType}-depositEta`])?.replace(
        'm',
        '',
      ),
    [estimateData, depositOption.tokenType],
  )
  const fee = useMemo(() => {
    const feeInUnits = Number(
      estimateData?.[`${depositOption.tokenType}-deposit-fee-in-units`] || 0,
    )
    return feeInUnits * (networkTokenPrice || 0)
  }, [estimateData, depositOption.tokenType, networkTokenPrice])

  return (
    <div className="flex flex-col gap-4 items-center">
      <img
        src={`https://app.hyperliquid.xyz/coins/${depositOption.value.toUpperCase()}.svg`}
        alt={depositOption.token}
        className={classNames(
          'rounded-full w-10 h-10',
          depositOption.value === 'eth' ? 'bg-white' : '',
        )}
      />
      <p className="text-center text-xs text-perps-muted-50">
        Deposits should arrive after ~{eta || 'N/A'} minute
        {Number(eta) === 1 ? '' : 's'}. This service is provided by Unit, an
        independent third-party. Unit charges an estimated fee of{' '}
        {fee ? `~${formatUSD(fee)}` : '$1-$2'} depending on the{' '}
        <span className="capitalize">{depositOption.chainName} </span> network.
        Pending deposits will be shown after they are reflected by Unit&apos;s
        API. For support with your deposit, open a ticket with{' '}
        <LinkExternal href="https://app.hyperunit.xyz/support">
          Unit.
        </LinkExternal>
      </p>
      {address ? (
        <PerpsCard className="p-2" fullWidth rounded="xl">
          <div className=" gap-2 w-full flex items-center justify-center">
            {isLoadingDepositData ? (
              <SkeletonText className="w-full" />
            ) : (
              <div className="text-xs break-all">{depositData?.address}</div>
            )}
            <IconButton
              name="share"
              size="xs"
              icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
              onClick={() => staticCopy(depositData?.address || '')}
              variant="perps-tertiary"
              className="rounded-xl !text-perps-muted-50"
            />
          </div>
        </PerpsCard>
      ) : null}
      <Checker.Connect size="default" variant="perps-tertiary" namespace="evm">
        <Button
          variant="perps-tertiary"
          size="default"
          className="w-full"
          onClick={() => {
            setOpen(false)
          }}
        >
          Done
        </Button>
      </Checker.Connect>
      <p className="text-center text-xs text-red">
        IMPORTANT: There is a minimum deposit of {depositOption.minDeposit}{' '}
        {depositOption.token.toUpperCase()}. This address can only receive{' '}
        {depositOption.token.toUpperCase()} on the{' '}
        <span className="capitalize">{depositOption.chainName} </span> network.
        Any other asset (e.g., USDC, USDT) sent from{' '}
        <span className="capitalize">{depositOption.chainName} </span> will be
        lost. Deposits below {depositOption.minDeposit}{' '}
        {depositOption.token.toUpperCase()} will result in a loss of funds.
      </p>
    </div>
  )
}
