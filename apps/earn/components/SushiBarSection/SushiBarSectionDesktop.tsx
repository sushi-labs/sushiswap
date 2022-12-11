import { BigNumber } from '@ethersproject/bignumber'
import { ErrorCode } from '@ethersproject/logger'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import chains, { ChainId } from '@sushiswap/chain'
import { SUSHI, tryParseAmount, XSUSHI } from '@sushiswap/currency'
import { formatPercent } from '@sushiswap/format'
import { XSushi } from '@sushiswap/graph-client'
import { FundSource } from '@sushiswap/hooks'
import { Button, classNames, createErrorToast, Dots, Link } from '@sushiswap/ui'
import { Approve, Checker, useBalances } from '@sushiswap/wagmi'
import { getSushiBarContractConfig } from '@sushiswap/wagmi/hooks/useSushiBarContract'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'

import { useNotifications } from '../../lib/state/storage'
import { SushiBarInput } from './SushiBarInput'

const SUSHI_TOKEN = SUSHI[ChainId.ETHEREUM]
const XSUSHI_TOKEN = XSUSHI[ChainId.ETHEREUM]

export const SushiBarSectionDesktop: FC = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [stake, setStake] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')
  const [, setOtherValue] = useState<string>('')
  const [, { createNotification }] = useNotifications(address)

  const { data: stats } = useSWR<XSushi>(`/earn/api/bar`, (url) => fetch(url).then((response) => response.json()))

  const onSettled: any = useCallback(
    (data: SendTransactionResult | undefined, e: Error) => {
      // TODO: ignore until wagmi workaround on ethers error
      // @ts-ignore
      if (e?.code !== ErrorCode.ACTION_REJECTED) {
        createErrorToast(e?.message, true)
      }

      if (data && chain?.id) {
        const ts = new Date().getTime()
        createNotification({
          type: stake ? 'enterBar' : 'leaveBar',
          chainId: chain.id,
          txHash: data.hash,
          promise: data.wait(),
          summary: {
            pending: `${stake ? 'Entering' : 'Exiting'} the Bar`,
            completed: `Successfully ${stake ? 'entered' : 'exited'} the Bar`,
            failed: `Something went wrong ${stake ? 'entering' : 'exiting'} the Bar`,
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      }
    },
    [chain?.id, createNotification, stake]
  )

  const amount = useMemo(() => tryParseAmount(value, stake ? SUSHI_TOKEN : XSUSHI_TOKEN), [stake, value])

  const { config } = usePrepareContractWrite({
    ...getSushiBarContractConfig(ChainId.ETHEREUM),
    functionName: stake ? 'enter' : 'leave',
    args: amount ? [BigNumber.from(amount.quotient.toString())] : undefined,
    enabled: !!amount?.quotient,
  })

  const { write, isLoading: isWritePending } = useContractWrite({
    ...config,
    onSettled,
  })

  const { data: balances } = useBalances({
    currencies: [SUSHI_TOKEN, XSUSHI_TOKEN],
    chainId: ChainId.ETHEREUM,
    account: address,
  })

  useEffect(() => {
    setValue('')
  }, [stake])

  return (
    <section className="hidden md:flex">
      <div className="flex flex-col w-full gap-6">
        <h4 className="font-semibold text-slate-50">Earn trading fees from all pools on Sushi!</h4>
        <div className="p-5 flex flex-col rounded-2xl bg-white bg-opacity-[0.02]">
          <div className="flex flex-col lg:flex-row">
            <div className="flex flex-col justify-center px-5">
              <h4 className="mb-1 font-semibold text-slate-50 whitespace-nowrap">Sushi Bar</h4>
              <p className="text-sm text-slate-400">APR (1y)</p>
              <p className="flex items-center gap-1 text-transparent bg-gradient-to-r from-red to-yellow bg-clip-text">
                {formatPercent(stats?.apr12m)}
                <Link.External href={chains[ChainId.ETHEREUM].getTokenUrl(XSUSHI_TOKEN.address)}>
                  <ExternalLinkIcon width={16} height={16} className="text-slate-200 hover:text-blue" />
                </Link.External>
              </p>
            </div>
            <div className="flex items-start flex-grow gap-5 p-5">
              <div className={classNames(stake ? 'order-1 flex-grow' : 'order-3')}>
                <SushiBarInput
                  currency={SUSHI_TOKEN}
                  balance={balances?.[SUSHI_TOKEN.address]?.[FundSource.WALLET]}
                  value={stake ? value : (Number(value) * Number(stats?.sushiXsushiRatio)).toFixed(6)}
                  onChange={stake ? setValue : setOtherValue}
                  disabled={!stake}
                />
              </div>
              <button
                type="button"
                onClick={() => setStake((prev) => !prev)}
                className="order-2 mt-2.5 group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"
              >
                <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">
                  <SwitchHorizontalIcon width={16} height={16} />
                </div>
              </button>
              <div className={classNames(!stake ? 'order-1 flex-grow' : 'order-3')}>
                <SushiBarInput
                  currency={XSUSHI_TOKEN}
                  balance={balances?.[XSUSHI_TOKEN.address]?.[FundSource.WALLET]}
                  value={stake ? (value ? (Number(value) / Number(stats?.sushiXsushiRatio)).toFixed(6) : '') : value}
                  onChange={stake ? setOtherValue : setValue}
                  disabled={stake}
                />
              </div>
              <div className="flex order-4 gap-1">
                <Approve
                  onSuccess={createNotification}
                  className="flex !flex-row !justify-center"
                  components={
                    <Approve.Components>
                      <Approve.Token
                        hideIcon
                        className="whitespace-nowrap w-[213px] min-h-[48px]"
                        amount={amount}
                        address={getSushiBarContractConfig(ChainId.ETHEREUM).address}
                      />
                    </Approve.Components>
                  }
                  render={({ approved }) => {
                    return (
                      <Checker.Connected className="whitespace-nowrap !h-[48px] w-[213px]">
                        <Checker.Network className="whitespace-nowrap !h-[48px] w-[213px]" chainId={ChainId.ETHEREUM}>
                          <Checker.Amounts
                            className="whitespace-nowrap !h-[48px] w-[213px]"
                            chainId={ChainId.ETHEREUM}
                            fundSource={FundSource.WALLET}
                            amounts={[amount]}
                          >
                            <Button
                              className="!h-[48px] w-[213px] rounded-2xl"
                              fullWidth
                              onClick={() => write?.()}
                              disabled={!approved || isWritePending}
                            >
                              {isWritePending ? <Dots>Confirm transaction</Dots> : stake ? 'Stake' : 'Unstake'}
                            </Button>
                          </Checker.Amounts>
                        </Checker.Network>
                      </Checker.Connected>
                    )
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
