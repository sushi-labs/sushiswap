import { ArrowRightIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { STARGATE_BRIDGE_TOKENS } from '@sushiswap/stargate'
import { AppearOnMount, Button, Typography } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker, Web3Input } from '@sushiswap/wagmi'
import {
  BridgeExecuteProvider,
  BridgeReviewModal,
  BridgeStateProvider,
  Layout,
  NetworkSelector,
  SettingsOverlay,
  SwapStatsDisclosure,
  useBridgeState,
  useBridgeStateActions,
} from 'components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import React, { FC, useCallback, useEffect, useMemo } from 'react'

import { useBridgeOutput } from '../lib/hooks'
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
          srcChainId: Number(srcChainId),
          dstChainId: Number(dstChainId),
          srcToken: srcTokens.includes(srcToken) ? srcTokens[srcTokens.indexOf(srcToken)] : srcTokens[0],
          dstToken: dstTokens.includes(dstToken) ? dstTokens[dstTokens.indexOf(dstToken)] : dstTokens[0],
          srcTypedAmount: !isNaN(Number(srcTypedAmount)) ? srcTypedAmount : '',
          dstTypedAmount: '',
          amount: !isNaN(Number(srcTypedAmount)) ? tryParseAmount(srcTypedAmount, srcToken) : undefined,
        }}
      >
        <BridgeExecuteProvider>
          <_Bridge />
        </BridgeExecuteProvider>
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
  const { dstAmountOut } = useBridgeOutput()
  const { amount, srcChainId, dstChainId, srcToken, dstToken, srcTypedAmount, dstTypedAmount } = useBridgeState()

  const {
    setSrcChainId,
    setDstChainId,
    setSrcToken,
    setDstToken,
    setSrcTypedAmount,
    setDstTypedAmount,
    switchChainIds,
  } = useBridgeStateActions()

  const [srcCustomTokenMap, { addCustomToken: onAddSrcCustomToken, removeCustomToken: onRemoveSrcCustomToken }] =
    useCustomTokens(srcChainId)
  const [dstCustomTokenMap, { addCustomToken: onAddDstCustomToken, removeCustomToken: onRemoveDstCustomToken }] =
    useCustomTokens(dstChainId)

  const srcTokens = useMemo(() => STARGATE_TOKEN_MAP[srcChainId], [srcChainId])
  const dstTokens = useMemo(() => STARGATE_TOKEN_MAP[dstChainId], [dstChainId])

  useEffect(() => setDstTypedAmount(dstAmountOut?.toExact() ?? ''), [dstAmountOut, setDstTypedAmount])

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
        <div className="grid grid-cols-[auto_40px_auto] items-center p-3">
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
            <AppearOnMount>
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
            </AppearOnMount>
          </div>
          <div className="border-b border-slate-200/5" />
          <div className="flex flex-col py-1">
            <Typography variant="xs" weight={500} className="text-slate-400">
              Receive
            </Typography>
            <AppearOnMount>
              <Web3Input.Currency
                disabled
                disableMaxButton
                value={dstTypedAmount}
                onChange={setDstTypedAmount}
                onSelect={setDstToken}
                currency={dstToken}
                chainId={dstChainId}
                tokenMap={dstTokens}
                customTokenMap={dstCustomTokenMap}
                onAddToken={onAddDstCustomToken}
                onRemoveToken={onRemoveDstCustomToken}
                loading={amount?.greaterThan(ZERO) && !dstTypedAmount}
              />
            </AppearOnMount>
          </div>
        </div>
        <div className="bg-slate-800">
          <SwapStatsDisclosure />
          <div className="p-3 pt-0">
            <Checker.Connected fullWidth size="md">
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
            </Checker.Connected>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  )
}
