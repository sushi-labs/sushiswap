'use client'
import {
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SkeletonText,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { useUserFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD } from 'sushi'
import { TableButton } from '~evm/perps/_ui/_common'

export const Volume = () => {
  const address = useAccount('evm')
  const { data: feeData, isLoading, error } = useUserFees({ address })
  const total14DayVolume = useMemo(() => {
    if (isLoading || error || !feeData) return '0'
    return feeData?.dailyUserVlm?.reduce((acc, i) => {
      return acc + Number(i.userCross) + Number(i.userAdd)
    }, 0)
  }, [feeData, isLoading, error])

  const volumeData = useMemo(() => {
    if (isLoading || error || !feeData) return []
    return feeData.dailyUserVlm
      ?.slice(1)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [feeData, isLoading, error])

  return (
    <Card className="p-2 !rounded-md gap-2 flex !bg-[#18223B] border-transparent flex-col w-full">
      <div className="text-muted-foreground lg:text-base text-sm">
        14 Day Volume
      </div>
      {isLoading ? (
        <div className="w-24">
          <SkeletonText fontSize="2xl" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading volume</div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">
          {formatUSD(total14DayVolume)}
        </div>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <TableButton
            className="w-fit md:text-base text-sm"
            disabled={isLoading || !!error}
          >
            View Volume
          </TableButton>
        </DialogTrigger>
        <DialogContent variant="perps-default" className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle className="!text-left">
              Your Volume History
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className="max-h-[calc(100vh-150px)] overflow-y-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-muted-foreground whitespace-nowrap border-b border-accent">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Exchange Volume</th>
                  <th className="pb-2 pr-4">Your Weighted Maker Volume</th>
                  <th className="pb-2 pr-4">Your Weighted Taker Volume</th>
                </tr>
              </thead>

              <tbody>
                {volumeData?.map((item) => (
                  <tr
                    key={item.date}
                    className="text-sm whitespace-nowrap pb-1"
                  >
                    <td className="py-1 pr-4">{item.date}</td>
                    <td className="py-1 pr-4">{formatUSD(item.exchange)}</td>
                    <td className="py-1 pr-4">{formatUSD(item.userAdd)}</td>
                    <td className="py-1 pr-4">{formatUSD(item.userCross)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-muted-foreground">
              Dates are based on UTC time zone and do not include the current
              day. Perps and spot volume are counted together to determine your
              fee tier, and spot volume counts double toward your fee tier.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
