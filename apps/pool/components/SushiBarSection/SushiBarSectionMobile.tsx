import { ExternalLinkIcon } from '@heroicons/react/outline'
import chains, { Chain, ChainId } from '@sushiswap/chain'
import { SUSHI, tryParseAmount, XSUSHI } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, createToast, Currency as UICurrency, Dialog, Dots, Link, Tab, Typography } from '@sushiswap/ui'
import { Approve, Checker, useBalances } from '@sushiswap/wagmi'
import { getSushiBarContractConfig } from '@sushiswap/wagmi/hooks/useSushiBarContract'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

import { SushiBarInput } from './SushiBarInput'

const SUSHI_TOKEN = SUSHI[ChainId.ETHEREUM]
const XSUSHI_TOKEN = XSUSHI[ChainId.ETHEREUM]

export const SushiBarSectionMobile: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  const { data: stats } = useSWR<{ apr: { '1m': string } }>(`pool/api/bar`, (url) =>
    fetch(url).then((response) => response.json())
  )

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

    const data = await writeAsync({ args: [amount.quotient.toString()] })

    createToast({
      txHash: data.hash,
      href: Chain.from(activeChain.id).getTxUrl(data.hash),
      promise: data.wait(),
      summary: {
        pending: <Dots>{selectedIndex === 0 ? 'Entering' : 'Exiting'} the Bar</Dots>,
        completed: `Successfully ${selectedIndex === 0 ? 'entered' : 'exited'} the Bar`,
        failed: `Something went wrong ${selectedIndex === 0 ? 'entering' : 'exiting'} the Bar`,
      },
    })
  }, [activeChain?.id, amount, writeAsync, selectedIndex])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <section className="flex md:hidden">
      <div className="flex flex-col w-full gap-6 rounded-2xl bg-white bg-opacity-[0.02] p-6">
        <div className="flex flex gap-3">
          <div className="min-w-[44px] min-h-[44px] mt-1">
            <UICurrency.Icon currency={XSUSHI_TOKEN} width={44} height={44} />
          </div>
          <div className="flex flex-col">
            <Typography variant="lg" weight={600} className="text-slate-100">
              Sushi Bar
            </Typography>
            <Typography variant="sm" weight={400} className="text-slate-400 -mt-1">
              Stake to earn trading fee from all pools on Sushi!
            </Typography>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}>Stake / Unstake</Button>
        <Dialog open={open} onClose={handleClose}>
          <Dialog.Content className="pb-[84px]">
            <Dialog.Header title="Sushi Bar" onClose={handleClose} />
            <div className="py-3 flex flex-col gap-3">
              <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List>
                  <Tab size="default">Stake</Tab>
                  <Tab size="default">Unstake</Tab>
                </Tab.List>
                <div className="flex flex-col justify-center p-3 gap-10">
                  <div className="flex flex-col items-center">
                    <Typography variant="sm" weight={400} className="text-center text-slate-300">
                      Stake to earn trading fee from all pools on Sushi!
                    </Typography>
                    <div className="flex gap-2 items-center mt-1">
                      <Typography variant="xs" className="text-slate-400 text-center">
                        APR (1m)
                      </Typography>
                      <Typography
                        variant="xs"
                        className="flex gap-1 items-center bg-gradient-to-r from-red to-yellow bg-clip-text text-transparent"
                      >
                        {stats?.apr?.['1m']}
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
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Dialog.Content>
        </Dialog>
      </div>
    </section>
  )
}
