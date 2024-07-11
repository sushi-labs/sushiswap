'use client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SkeletonBox,
} from '@sushiswap/ui'
import { PortfolioTab } from './PortfolioTab'
import { AddressToEnsResolver } from 'src/lib/wagmi/components/account/AddressToEnsResolver'
import { shortenAddress } from 'sushi'
import { useAccount } from 'wagmi'

export const Portfolio = () => {
  const account = useAccount()
  return (
    <Sheet>
      <SheetTrigger>Portfolio</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <AddressToEnsResolver address={account.address}>
              {({ isLoading, data }) => {
                return (
                  <>
                    {account.address ? (
                      isLoading || !data ? (
                        shortenAddress(account.address)
                      ) : (
                        <div className="flex flex-col w-full">
                          <span className="flex gap-1 font-semibold">
                            {`${data}`}
                          </span>
                          <span className="font-small text-gray-400 dark:text-slate-600">
                            {shortenAddress(account.address)}
                          </span>
                        </div>
                      )
                    ) : (
                      <SkeletonBox className="h-4 w-20" />
                    )}
                  </>
                )
              }}
            </AddressToEnsResolver>
          </SheetTitle>
        </SheetHeader>
        <PortfolioTab />
      </SheetContent>
    </Sheet>
  )
}
