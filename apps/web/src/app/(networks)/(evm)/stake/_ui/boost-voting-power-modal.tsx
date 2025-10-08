'use client'

import { ArrowUpRightIcon, FireIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Currency,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  List,
  SkeletonCircle,
  SkeletonText,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { Fraction } from 'sushi'
import { EvmChainId, type EvmCurrency, XSUSHI } from 'sushi/evm'
import { SUSHI_ETH_SLP } from './voting-power-provider'

export const BoostVotingPowerModal = ({
  weights,
}: {
  weights:
    | {
        xsushi: Fraction
        slp: Fraction
        xsushiPolygon: Fraction
      }
    | undefined
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'secondary'} icon={FireIcon}>
          Boost Voting Power
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Boost Voting Power</DialogTitle>
          <DialogDescription>
            Acquire tokens from the list below to increase your voting power.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <List>
            <CurrencyListItem
              isLoading={!weights}
              currency={XSUSHI[EvmChainId.ETHEREUM]}
              weight={weights?.xsushi}
              link="https://sushi.com/bar"
            />
            <CurrencyListItem
              isLoading={!weights}
              currency={SUSHI_ETH_SLP}
              weight={weights?.slp}
              link="https://www.sushi.com/pool/add/v2/1"
            />
            <CurrencyListItem
              isLoading={!weights}
              currency={XSUSHI[EvmChainId.POLYGON]}
              weight={weights?.xsushiPolygon}
              link="https://www.sushi.com/swap?chainId=137&token0=0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a&token1=0x6811079E3c63ED96Eb005384d7E7ec8810E3D521"
            />
          </List>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CurrencyListItem {
  currency: EvmCurrency
  isLoading: boolean
  weight: Fraction | undefined
  link: string
}

const CurrencyListItem = ({
  isLoading,
  currency,
  weight,
  link,
}: CurrencyListItem) => {
  return (
    <List.Control>
      <div className="relative flex gap-4 px-4 py-3 w-full items-center cursor-default">
        {isLoading ? (
          <>
            <SkeletonCircle radius={36} />
            <div className="flex flex-col gap-0.5 items-start w-full">
              <SkeletonText fontSize="sm" />
              <SkeletonText fontSize="xs" />
            </div>
          </>
        ) : (
          <>
            <div className="relative">
              <Currency.Icon currency={currency} width={36} height={36} />
              <div className="absolute -bottom-1 -right-1">
                <NetworkIcon
                  chainId={currency.chainId}
                  width={16}
                  height={16}
                />
              </div>
            </div>
            <div className="flex flex-col gap-0.5 items-start">
              <span className="text-sm font-medium dark:text-slate-200">
                {`${currency.name}`}
              </span>
              <span className="text-[10px] text-gray-700 dark:text-slate-400 text-left">
                {`1 ${currency.symbol} = ${weight?.toSignificant(
                  4,
                )} SUSHIPOWAH`}
              </span>
            </div>
            <div className="grow flex justify-end">
              <a
                target="_blank"
                href={link}
                rel="noreferrer"
                className="text-blue gap-1 text-sm flex"
              >
                Get Token
                <ArrowUpRightIcon width={8.75} height={8.75} />
              </a>
            </div>
          </>
        )}
      </div>
    </List.Control>
  )
}
