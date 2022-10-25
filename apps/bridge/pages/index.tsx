import { ArrowRightIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { Button, Loader, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker, Web3Input } from '@sushiswap/wagmi'
import {
  BridgeReviewModal,
  BridgeStateProvider,
  Layout,
  NetworkSelector,
  SettingsOverlay,
  SwapStatsDisclosure,
  useBridgeState,
  useBridgeStateActions,
  useDerivedBridgeState,
} from 'components'
import { nanoid } from 'nanoid'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import React, { FC, useCallback, useMemo } from 'react'

import { useCustomTokens } from '../lib/state/storage'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const { srcToken, dstToken, srcChainId, dstChainId, srcTypedAmount } = query
  return {
    props: {
      srcToken: srcToken ?? null,
      dstToken: dstToken ?? null,
      srcChainId: srcChainId ?? ChainId.ETHEREUM,
      dstChainId: dstChainId ?? ChainId.ARBITRUM,
      srcTypedAmount: !isNaN(Number(srcTypedAmount)) ? srcTypedAmount : '',
    },
  }
}

export default function Bridge({
  srcChainId,
  dstChainId,
  srcToken,
  dstToken,
  srcTypedAmount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const srcTokens = useMemo(() => STARGATE_BRIDGE_TOKENS[srcChainId], [srcChainId])
  const dstTokens = useMemo(() => STARGATE_BRIDGE_TOKENS[dstChainId], [dstChainId])
  return (
    <Layout>
      <Head>
        <title>Bridge | Sushi</title>
        <meta property="og:title" content="Bridge | Sushi" key="title" />
      </Head>
      <BridgeStateProvider
        initialState={{
          id: nanoid(),
          srcChainId: Number(srcChainId),
          dstChainId: Number(dstChainId),
          srcToken: srcTokens.includes(srcToken) ? srcTokens[srcTokens.indexOf(srcToken)] : srcTokens[0],
          dstToken: dstTokens.includes(dstToken) ? dstTokens[dstTokens.indexOf(dstToken)] : dstTokens[0],
          srcTypedAmount: !isNaN(Number(srcTypedAmount)) ? srcTypedAmount : '',
          dstTypedAmount: '',
          amount: !isNaN(Number(srcTypedAmount)) ? tryParseAmount(srcTypedAmount, srcToken) : undefined,
        }}
      >
        <_Bridge />
      </BridgeStateProvider>
    </Layout>
  )
}

const STARGATE_TOKEN_MAP = Object.fromEntries(
  Object.entries(STARGATE_BRIDGE_TOKENS).map(([chainId, tokens]) => [
    chainId,
    Object.fromEntries(tokens.map((token) => [token.address, token])),
  ])
)

const _Bridge: FC = () => {
  const isMounted = useIsMounted()
  const { srcChainId, dstChainId, srcToken, dstToken, srcTypedAmount } = useBridgeState()
  const { dstAmountOut, isLoading } = useDerivedBridgeState()
  const { setSrcChainId, setDstChainId, setSrcToken, setDstToken, setSrcTypedAmount, switchChainIds } =
    useBridgeStateActions()

  const [srcCustomTokenMap, { addCustomToken: onAddSrcCustomToken, removeCustomToken: onRemoveSrcCustomToken }] =
    useCustomTokens(srcChainId)
  const [dstCustomTokenMap, { addCustomToken: onAddDstCustomToken, removeCustomToken: onRemoveDstCustomToken }] =
    useCustomTokens(dstChainId)

  const srcTokens = useMemo(() => STARGATE_TOKEN_MAP[srcChainId], [srcChainId])
  const dstTokens = useMemo(() => STARGATE_TOKEN_MAP[dstChainId], [dstChainId])

  const inputAmounts = useMemo(() => {
    return [tryParseAmount(srcTypedAmount, srcToken)]
  }, [srcToken, srcTypedAmount])

  const onSrcNetworkSelect = useCallback(
    (chainId: number) => {
      setSrcChainId(chainId)
      setSrcToken(STARGATE_BRIDGE_TOKENS[chainId][0])
    },
    [setSrcChainId, setSrcToken]
  )

  const onDstNetworkSelect = useCallback(
    (chainId: number) => {
      setDstChainId(chainId)
      setDstToken(STARGATE_BRIDGE_TOKENS[chainId][0])
    },
    [setDstChainId, setDstToken]
  )

  return (
    <Widget id="bridge" maxWidth={400}>
      <Widget.Content>
        <Widget.Header title="Bridge">
          <div className="flex justify-end">
            <SettingsOverlay />
          </div>
        </Widget.Header>
        <div className="grid grid-cols-[176px_24px_176px] items-center p-3">
          <NetworkSelector label="From" value={srcChainId} onChange={onSrcNetworkSelect} />
          <div className="flex items-center justify-center">
            <button
              onClick={() => switchChainIds()}
              className="cursor-pointer bg-slate-800 hover:ring-2 ring-offset-2 ring-offset-slate-700 ring-slate-800 rounded-full p-[5px]"
            >
              <ArrowRightIcon width={14} height={14} />
            </button>
          </div>
          <div className="flex justify-end">
            <NetworkSelector label="To" value={dstChainId} onChange={onDstNetworkSelect} />
          </div>
        </div>
        <div className="bg-slate-800 p-3 flex flex-col gap-3">
          <div className="flex flex-col py-1">
            <Typography variant="xs" weight={500} className="text-slate-400">
              Send
            </Typography>
            <Web3Input.Currency
              value={srcTypedAmount}
              onChange={setSrcTypedAmount}
              onSelect={setSrcToken}
              currency={srcToken}
              chainId={srcChainId}
              tokenMap={srcTokens}
              customTokenMap={srcCustomTokenMap}
              onAddToken={onAddSrcCustomToken}
              onRemoveToken={onRemoveSrcCustomToken}
            />
          </div>
          <div className="border-b border-slate-200/5" />
          <div className="flex flex-col py-1">
            <Typography variant="xs" weight={500} className="text-slate-400">
              Receive
            </Typography>
            <Web3Input.Currency
              disabled
              disableMaxButton
              value={dstAmountOut?.toExact() || ''}
              onChange={() => {}}
              onSelect={setDstToken}
              currency={dstToken}
              chainId={dstChainId}
              tokenMap={dstTokens}
              customTokenMap={dstCustomTokenMap}
              onAddToken={onAddDstCustomToken}
              onRemoveToken={onRemoveDstCustomToken}
              loading={isLoading}
            />
          </div>
        </div>
        <div className="bg-slate-800">
          <SwapStatsDisclosure />
          <div className="p-3 pt-0">
            <Checker.Connected fullWidth size="md">
              <Checker.Custom
                showGuardIfTrue={isLoading && isMounted}
                guard={
                  <Button size="md" fullWidth>
                    <Loader size={18} />
                  </Button>
                }
              >
                <Checker.Amounts
                  fullWidth
                  size="md"
                  chainId={srcChainId}
                  fundSource={FundSource.WALLET}
                  amounts={inputAmounts}
                >
                  <Checker.Network fullWidth size="md" chainId={srcChainId}>
                    <BridgeReviewModal>
                      {({ setOpen }) => {
                        return (
                          <Button fullWidth size="md" onClick={() => setOpen(true)}>
                            Bridge
                          </Button>
                        )
                      }}
                    </BridgeReviewModal>
                  </Checker.Network>
                </Checker.Amounts>
              </Checker.Custom>
            </Checker.Connected>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  )
}
