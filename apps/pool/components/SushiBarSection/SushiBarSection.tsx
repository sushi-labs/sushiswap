import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { Chain, ChainId } from '@sushiswap/chain'
import { SUSHI, tryParseAmount, XSUSHI } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { Button, classNames, createToast, Dots } from '@sushiswap/ui'
import { useBalances } from '@sushiswap/wagmi'
import { getSushiBarContractConfig } from '@sushiswap/wagmi/hooks/useSushiBarContract'
import Image from 'next/image'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

import { SushiBarInput } from './SushiBarInput'

const SUSHI_TOKEN = SUSHI[ChainId.ETHEREUM]
const XSUSHI_TOKEN = XSUSHI[ChainId.ETHEREUM]

export const SushiBarSection: FC = () => {
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
  const [stake, setStake] = useState<boolean>(true)
  const [value, setValue] = useState<string>('')
  const [otherValue, setOtherValue] = useState<string>('')

  const { writeAsync } = useContractWrite({
    ...getSushiBarContractConfig(ChainId.ETHEREUM),
    functionName: stake ? 'enter' : 'leave',
  })

  const { data: balances } = useBalances({
    currencies: [SUSHI_TOKEN, XSUSHI_TOKEN],
    chainId: ChainId.ETHEREUM,
    account: address,
  })

  const execute = useCallback(async () => {
    const amount = tryParseAmount(value, stake ? SUSHI_TOKEN : XSUSHI_TOKEN)
    if (!activeChain?.id || !amount.greaterThan(ZERO)) return

    const data = await writeAsync({ args: [amount.quotient.toString()] })

    createToast({
      txHash: data.hash,
      href: Chain.from(activeChain.id).getTxUrl(data.hash),
      promise: data.wait(),
      summary: {
        pending: <Dots>{stake ? 'Entering' : 'Exiting'} the Bar</Dots>,
        completed: `Successfully ${stake ? 'entered' : 'exited'} the Bar`,
        failed: `Something went wrong ${stake ? 'entering' : 'exiting'} the Bar`,
      },
    })
  }, [value, stake, activeChain?.id, writeAsync])

  return (
    <section className="flex">
      <div className="flex w-full flex-col gap-6">
        <h4 className="text-slate-50 font-bold">Earn trading fees from all pools on Sushi!</h4>
        <div className="p-5 flex rounded-2xl bg-white bg-opacity-[0.02]">
          <div className="border-r border-slate-200/5 grid grid-cols-[72px_auto] items-center gap-4 px-5">
            <div className="relative">
              <Image src="/images/SushiBarNeonSign.png" layout="fill" />
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-slate-50 mb-1">Sushi Bar</h4>
              <p className="text-sm text-slate-400">APR (1m)</p>
              <p className="flex gap-1 items-center bg-gradient-to-r from-red to-yellow bg-clip-text text-transparent">
                11.84% <ExternalLinkIcon width={16} height={16} className="text-slate-200" />
              </p>
            </div>
          </div>
          <div className="p-5 flex flex-grow gap-3 items-start">
            <div className={classNames(stake ? 'order-1 flex-grow' : 'order-3 max-w-[280px]')}>
              <SushiBarInput
                currency={SUSHI_TOKEN}
                balance={balances?.[SUSHI_TOKEN.address]?.[FundSource.WALLET]}
                value={stake ? value : otherValue}
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
            <div className={classNames(!stake ? 'order-1 flex-grow' : 'order-3 max-w-[280px]')}>
              <SushiBarInput
                currency={XSUSHI_TOKEN}
                balance={balances?.[XSUSHI_TOKEN.address]?.[FundSource.WALLET]}
                value={stake ? otherValue : value}
                onChange={stake ? setOtherValue : setValue}
                disabled={stake}
              />
            </div>
            <Button onClick={execute} fullWidth className="max-w-[108px] order-4">
              {stake ? 'Stake' : 'Unstake'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
