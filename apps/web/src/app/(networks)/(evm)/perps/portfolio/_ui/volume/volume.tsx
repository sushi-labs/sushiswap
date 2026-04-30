'use client'
import {
  PerpsDialog,
  PerpsDialogContent,
  PerpsDialogDescription,
  PerpsDialogHeader,
  PerpsDialogInnerContent,
  PerpsDialogTitle,
  PerpsDialogTrigger,
  SkeletonText,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { currencyFormatter, useUserFees } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { formatUSD } from 'sushi'
import { PerpsCard, TableButton } from '~evm/perps/_ui/_common'

export const Volume = () => {
  const address = useAccount('evm')
  const { data: feeData, isLoading, error } = useUserFees({ address })
  const total14DayVolume = useMemo(() => {
    if (isLoading || error || !feeData) return '0'
    return feeData?.dailyUserVlm?.slice(0, 14).reduce((acc, i) => {
      return acc + Number(i.userCross) + Number(i.userAdd)
    }, 0)
  }, [feeData, isLoading, error])

  const volumeData = useMemo(() => {
    if (isLoading || error || !feeData) return []
    return feeData.dailyUserVlm
      ?.slice(0, 14)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [feeData, isLoading, error])

  return (
    <PerpsCard
      className="p-2 gap-2 flex flex-col justify-between"
      fullWidth
      fullHeight
    >
      <div className="text-perps-muted-50 text-xs lg:text-sm">
        14 Day Volume
      </div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading volume</div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">
          {formatUSD(total14DayVolume)}
        </div>
      )}
      <PerpsDialog>
        <PerpsDialogTrigger asChild>
          <TableButton
            variant="gradient"
            className="w-fit text-xs lg:text-sm "
            disabled={isLoading || !!error || !address}
          >
            View Volume
          </TableButton>
        </PerpsDialogTrigger>
        <PerpsDialogContent className="!max-w-3xl">
          <PerpsDialogHeader>
            <PerpsDialogTitle>Your Volume History</PerpsDialogTitle>
            <PerpsDialogDescription />
          </PerpsDialogHeader>
          <PerpsDialogInnerContent>
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-perps-muted-50 whitespace-nowrap border-b  border-accent">
                  <th className="font-medium pb-2 pr-4">Date</th>
                  <th className="font-medium pb-2 pr-4">Exchange Volume</th>
                  <th className="font-medium pb-2 pr-4">
                    Your Weighted Maker Volume
                  </th>
                  <th className="font-medium pb-2 pr-4">
                    Your Weighted Taker Volume
                  </th>
                </tr>
              </thead>

              <tbody>
                {volumeData?.map((item) => (
                  <tr
                    key={item.date}
                    className="text-sm whitespace-nowrap pb-1"
                  >
                    <td className="py-1 pr-4">{item.date}</td>
                    <td className="py-1 pr-4">
                      {currencyFormatter.format(Number(item.exchange))}
                    </td>
                    <td className="py-1 pr-4">
                      {currencyFormatter.format(Number(item.userAdd))}
                    </td>
                    <td className="py-1 pr-4">
                      {currencyFormatter.format(Number(item.userCross))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs text-perps-muted-50">
              Dates are based on UTC time zone and do not include the current
              day. Perps and spot volume are counted together to determine your
              fee tier, and spot volume counts double toward your fee tier.
            </p>
          </PerpsDialogInnerContent>
        </PerpsDialogContent>
      </PerpsDialog>
    </PerpsCard>
  )
}
