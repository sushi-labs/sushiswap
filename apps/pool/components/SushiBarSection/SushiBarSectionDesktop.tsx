import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import chains, { Chain, ChainId } from '@sushiswap/chain'
import { SUSHI, tryParseAmount, XSUSHI } from '@sushiswap/currency'
import { formatNumber } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, classNames, createToast, Dots, Link, Typography } from '@sushiswap/ui'
import { Approve, Checker, useBalances } from '@sushiswap/wagmi'
import { getSushiBarContractConfig } from '@sushiswap/wagmi/hooks/useSushiBarContract'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, useAccount, useContractWrite, useNetwork, UserRejectedRequestError } from 'wagmi'

import { XSushi } from '../../.graphclient'
import { SushiBarInput } from './SushiBarInput'

const SUSHI_TOKEN = SUSHI[ChainId.ETHEREUM]
const XSUSHI_TOKEN = XSUSHI[ChainId.ETHEREUM]

export const SushiBarSectionDesktop: FC = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [stake, setStake] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')
  const [, setOtherValue] = useState<string>('')
  const [error, setError] = useState<string>()

  const { data: stats } = useSWR<XSushi>(`/pool/api/bar`, (url) => fetch(url).then((response) => response.json()))

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...getSushiBarContractConfig(ChainId.ETHEREUM),
    functionName: stake ? 'enter' : 'leave',
  })

  const { data: balances } = useBalances({
    currencies: [SUSHI_TOKEN, XSUSHI_TOKEN],
    chainId: ChainId.ETHEREUM,
    account: address,
  })

  const amount = useMemo(() => tryParseAmount(value, stake ? SUSHI_TOKEN : XSUSHI_TOKEN), [stake, value])

  const execute = useCallback(async () => {
    if (!chain?.id || !amount?.greaterThan(ZERO)) return

    try {
      const data = await writeAsync({ args: [amount.quotient.toString()] })

      createToast({
        txHash: data.hash,
        href: Chain.from(chain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: <Dots>{stake ? 'Entering' : 'Exiting'} the Bar</Dots>,
          completed: `Successfully ${stake ? 'entered' : 'exited'} the Bar`,
          failed: `Something went wrong ${stake ? 'entering' : 'exiting'} the Bar`,
        },
      })
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [chain?.id, amount, writeAsync, stake])

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
                {formatNumber(stats?.apr12m * 100)}
                <Link.External href={chains[ChainId.ETHEREUM].getTokenUrl(XSUSHI_TOKEN.address)}>
                  <ExternalLinkIcon width={16} height={16} className="text-slate-200 hover:text-blue" />
                </Link.External>
              </p>
            </div>
            <div className="flex items-start flex-grow gap-3 p-5">
              <div className={classNames(stake ? 'order-1 flex-grow' : 'order-3 max-w-[213px]')}>
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
                  <ChevronRightIcon width={16} height={16} />
                </div>
              </button>
              <div className={classNames(!stake ? 'order-1 flex-grow' : 'order-3 max-w-[213px]')}>
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
                  className="flex !flex-row !justify-center"
                  components={
                    <Approve.Components>
                      <Approve.Token
                        hideIcon
                        className="whitespace-nowrap w-[213px] min-h-[48px]"
                        amount={amount}
                        address={getSushiBarContractConfig(ChainId.ETHEREUM).addressOrName}
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
                              className="!h-[48px] w-[213px]"
                              fullWidth
                              onClick={execute}
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
          {error && (
            <Typography variant="xs" className="mt-4 text-center text-red" weight={500}>
              {error}
            </Typography>
          )}
        </div>
      </div>
    </section>
  )
}
