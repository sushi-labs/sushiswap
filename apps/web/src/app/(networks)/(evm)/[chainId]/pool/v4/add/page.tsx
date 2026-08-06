'use client'

import { FormSection, Message, TextField } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { type FC, use, useMemo, useState } from 'react'
import {
  SUSHISWAP_V4_HOOKS_ABI,
  SUSHISWAP_V4_SUPPORTED_CHAIN_IDS,
  type SushiSwapV4ChainId,
  createSushiSwapV4PoolKey,
  getHooksRegistration,
  getSushiSwapV4Deployment,
  getSushiSwapV4PoolId,
  useSushiSwapV4Pool,
} from 'src/lib/pool/v4'
import {
  type EvmAddress,
  getEvmChainById,
  isEvmWNativeSupported,
} from 'sushi/evm'
import { getAddress, isAddress, zeroAddress } from 'viem'
import { useConnection, useReadContract } from 'wagmi'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { SelectPricesWidget } from '~evm/[chainId]/_ui/select-prices-widget'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '../../_ui/concentrated-liquidity-url-state-provider'
import { SelectFeeConcentratedWidget } from '../../_ui/select-fee-concentrated-widget'
import { SelectNetworkWidget } from '../../_ui/select-network-widget'
import { SelectTokensWidget } from '../../_ui/select-tokens-widget'
import { ConcentratedLiquidityWidget } from '../../v3/_ui/concentrated-liquidity-widget'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  const chainId = +params.chainId as SushiSwapV4ChainId

  return (
    <ConcentratedLiquidityURLStateProvider
      chainId={chainId}
      supportedNetworks={[...SUSHISWAP_V4_SUPPORTED_CHAIN_IDS]}
    >
      <ConcentratedLiquidityProvider>
        <AddV4Liquidity />
      </ConcentratedLiquidityProvider>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const AddV4Liquidity: FC = () => {
  const { address } = useConnection()
  const router = useRouter()
  const {
    chainId,
    token0,
    token1,
    setToken1,
    setToken0,
    feeAmount,
    setFeeAmount,
    tokensLoading,
    switchTokens,
  } = useConcentratedLiquidityURLState()
  const deployment = getSushiSwapV4Deployment(chainId)
  const [hookInput, setHookInput] = useState('')
  const hookIsValid = hookInput === '' || isAddress(hookInput)
  const hooks =
    hookInput === '' || !hookIsValid ? zeroAddress : getAddress(hookInput)
  const hookRegistration = useReadContract({
    address: hooks as EvmAddress,
    abi: SUSHISWAP_V4_HOOKS_ABI,
    functionName: 'getHooksRegistrationBitmap',
    chainId,
    query: {
      enabled: hooks !== zeroAddress && hookIsValid,
    },
  })
  const hooksReady =
    hooks === zeroAddress ||
    (hookRegistration.data !== undefined && !hookRegistration.isError)

  const poolKey = useMemo(() => {
    if (
      !deployment ||
      !token0 ||
      !token1 ||
      !feeAmount ||
      !hookIsValid ||
      !hooksReady
    ) {
      return undefined
    }

    return createSushiSwapV4PoolKey({
      currencyA: token0,
      currencyB: token1,
      hooks,
      hooksRegistration:
        hooks === zeroAddress
          ? undefined
          : getHooksRegistration(Number(hookRegistration.data)),
      poolManager: deployment.clPoolManager,
      fee: feeAmount,
    })
  }, [
    deployment,
    feeAmount,
    hookIsValid,
    hookRegistration.data,
    hooks,
    hooksReady,
    token0,
    token1,
  ])
  const poolState = useSushiSwapV4Pool({
    chainId,
    deployment,
    poolKey,
  })
  const infinity =
    deployment && poolKey && poolState
      ? {
          deployment,
          poolKey,
          poolId: getSushiSwapV4PoolId(poolKey),
          isInitialized: poolState.isInitialized,
        }
      : undefined

  return (
    <>
      <SelectNetworkWidget
        selectedNetwork={chainId}
        onSelect={(nextChainId) =>
          router.push(`/${getEvmChainById(nextChainId).key}/pool/v4/add`)
        }
        networks={SUSHISWAP_V4_SUPPORTED_CHAIN_IDS}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
        includeNative={isEvmWNativeSupported(chainId)}
      />
      <SelectFeeConcentratedWidget
        chainId={chainId}
        feeAmount={feeAmount}
        setFeeAmount={setFeeAmount}
        token1={token1}
        token0={token0}
      />
      <FormSection
        title="Hooks"
        description="Optional Infinity hooks contract. Its registration bitmap is read directly from the contract."
      >
        <TextField
          type="text"
          value={hookInput}
          onValueChange={setHookInput}
          placeholder="0x… (optional)"
          isError={!hookIsValid || hookRegistration.isError}
        />
        {!hookIsValid ? (
          <Message size="sm" variant="destructive">
            Enter a valid hook contract address.
          </Message>
        ) : hookRegistration.isError ? (
          <Message size="sm" variant="destructive">
            This contract does not expose the Infinity hooks registration
            bitmap.
          </Message>
        ) : null}
      </FormSection>
      {!deployment ? (
        <Message size="sm" variant="warning">
          SushiSwap V4 contracts have not been configured for this network yet.
          Pool transactions will become available when the generated deployment
          addresses are added.
        </Message>
      ) : poolKey && poolState && infinity ? (
        <>
          <SelectPricesWidget
            chainId={chainId}
            token0={token0}
            token1={token1}
            poolAddress={undefined}
            tokenId={undefined}
            feeAmount={feeAmount}
            switchTokens={switchTokens}
            poolState={poolState}
          />
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            setToken0={setToken0}
            setToken1={setToken1}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={undefined}
            tokenId={undefined}
            poolState={poolState}
            infinity={infinity}
            successLink={`/${getEvmChainById(chainId).key}/pool/v4/${
              infinity.poolId
            }/positions`}
          />
        </>
      ) : null}
    </>
  )
}
