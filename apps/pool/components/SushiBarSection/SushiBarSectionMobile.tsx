import { ExternalLinkIcon } from '@heroicons/react/outline'
import chains, { ChainId } from '@sushiswap/chain'
import { SUSHI, tryParseAmount, XSUSHI } from '@sushiswap/currency'
import { formatNumber } from '@sushiswap/format'
import { XSushi } from '@sushiswap/graph-client/.graphclient'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, Currency as UICurrency, Dialog, Dots, Link, Tab, Typography } from '@sushiswap/ui'
import { Approve, Checker, useBalances } from '@sushiswap/wagmi'
import { getSushiBarContractConfig } from '@sushiswap/wagmi/hooks/useSushiBarContract'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'
import { ProviderRpcError, useAccount, useContractWrite, useNetwork, UserRejectedRequestError } from 'wagmi'

import { SushiBarInput } from './SushiBarInput'

import { useNotifications } from '../../lib/state/storage'

const SUSHI_TOKEN = SUSHI[ChainId.ETHEREUM]
const XSUSHI_TOKEN = XSUSHI[ChainId.ETHEREUM]

export const SushiBarSectionMobile: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [, { createNotification }] = useNotifications(address)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()

  const { data: stats } = useSWR<XSushi>(`pool/api/bar`, (url) => fetch(url).then((response) => response.json()))

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    ...getSushiBarContractConfig(ChainId.ETHEREUM),
    functionName: selectedIndex === 0 ? 'enter' : 'leave',
  })

  const { data: balances } = useBalances({
    currencies: [SUSHI_TOKEN, XSUSHI_TOKEN],
    chainId: ChainId.ETHEREUM,
    account: address,
  })

  const amount = tryParseAmount(value, selectedIndex === 0 ? SUSHI_TOKEN : XSUSHI_TOKEN)

  const execute = useCallback(async () => {
    if (!activeChain?.id || !amount?.greaterThan(ZERO)) return

    try {
      const data = await writeAsync({ args: [amount.quotient.toString()] })

      const ts = new Date().getTime()
      createNotification({
        type: selectedIndex === 0 ? 'enterBar' : 'leaveBar',
        chainId: activeChain.id,
        txHash: data.hash,
        promise: data.wait(),
        summary: {
          pending: `${selectedIndex === 0 ? 'Entering' : 'Exiting'} the Bar`,
          completed: `Successfully ${selectedIndex === 0 ? 'entered' : 'exited'} the Bar`,
          failed: `Something went wrong ${selectedIndex === 0 ? 'entering' : 'exiting'} the Bar`,
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        setError((e as ProviderRpcError).message)
      }

      console.log(e)
    }
  }, [activeChain?.id, amount, writeAsync, createNotification, selectedIndex])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <section className="flex md:hidden">
      <div className="flex flex-col w-full gap-6 rounded-2xl bg-white bg-opacity-[0.02] p-6">
        <div className="flex gap-3">
          <div className="min-w-[44px] min-h-[44px] mt-1">
            <UICurrency.Icon currency={XSUSHI_TOKEN} width={44} height={44} />
          </div>
          <div className="flex flex-col">
            <Typography variant="lg" weight={600} className="text-slate-100">
              Sushi Bar
            </Typography>
            <Typography variant="sm" weight={400} className="-mt-1 text-slate-400">
              Stake to earn trading fee from all pools on Sushi!
            </Typography>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}>Stake / Unstake</Button>
        <Dialog open={open} onClose={handleClose}>
          <Dialog.Content className="pb-[84px]">
            <Dialog.Header title="Sushi Bar" onClose={handleClose} />
            <div className="flex flex-col gap-3 py-3">
              <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List>
                  <Tab size="default">Stake</Tab>
                  <Tab size="default">Unstake</Tab>
                </Tab.List>
                <div className="flex flex-col justify-center gap-10 p-3">
                  <div className="flex flex-col items-center">
                    <Typography variant="sm" weight={400} className="text-center text-slate-300">
                      Stake to earn trading fee from all pools on Sushi!
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Typography variant="xs" className="text-center text-slate-400">
                        APR (1m)
                      </Typography>
                      <Typography
                        variant="xs"
                        className="flex items-center gap-1 text-transparent bg-gradient-to-r from-red to-yellow bg-clip-text"
                      >
                        {formatNumber(stats?.apr12m)}
                        <Link.External href={chains[ChainId.ETHEREUM].getTokenUrl(XSUSHI_TOKEN.address)}>
                          <ExternalLinkIcon width={12} height={12} className="text-slate-200 hover:text-blue" />
                        </Link.External>
                      </Typography>
                    </div>
                  </div>
                </div>
                <Tab.Panels className="flex flex-col gap-6">
                  <Tab.Panel>
                    <SushiBarInput
                      currency={SUSHI_TOKEN}
                      balance={balances?.[SUSHI_TOKEN.address]?.[FundSource.WALLET]}
                      value={value}
                      onChange={setValue}
                    />
                  </Tab.Panel>
                  <Tab.Panel>
                    <SushiBarInput
                      currency={XSUSHI_TOKEN}
                      balance={balances?.[XSUSHI_TOKEN.address]?.[FundSource.WALLET]}
                      value={value}
                      onChange={setValue}
                    />
                  </Tab.Panel>
                  <Dialog.Actions className="h-[84px]">
                    <Approve
                      onSuccess={createNotification}
                      className="flex !flex-row !justify-center"
                      components={
                        <Approve.Components>
                          <Approve.Token
                            hideIcon
                            fullWidth
                            size="md"
                            className="whitespace-nowrap min-h-[48px]"
                            amount={amount}
                            address={getSushiBarContractConfig(ChainId.ETHEREUM).addressOrName}
                          />
                        </Approve.Components>
                      }
                      render={({ approved }) => {
                        return (
                          <Checker.Connected size="md" fullWidth className="whitespace-nowrap">
                            <Checker.Network
                              size="md"
                              fullWidth
                              className="whitespace-nowrap"
                              chainId={ChainId.ETHEREUM}
                            >
                              <Checker.Amounts
                                size="md"
                                fullWidth
                                className="whitespace-nowrap"
                                chainId={ChainId.ETHEREUM}
                                fundSource={FundSource.WALLET}
                                amounts={[amount]}
                              >
                                <Button size="md" fullWidth onClick={execute} disabled={!approved || isWritePending}>
                                  {isWritePending ? (
                                    <Dots>Confirm transaction</Dots>
                                  ) : selectedIndex === 0 ? (
                                    'Stake'
                                  ) : (
                                    'Unstake'
                                  )}
                                </Button>
                              </Checker.Amounts>
                            </Checker.Network>
                          </Checker.Connected>
                        )
                      }}
                    />
                  </Dialog.Actions>
                  {error && (
                    <Typography variant="xs" className="mt-4 text-center text-red" weight={500}>
                      {error}
                    </Typography>
                  )}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Dialog.Content>
        </Dialog>
      </div>
    </section>
  )
}
