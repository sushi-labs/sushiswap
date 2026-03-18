'use client'
import { LinkExternal, Message } from '@sushiswap/ui'
import { useLegalCheck } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'

export const GeoBlockedMessage = ({
  isGeoBlocked,
}: {
  isGeoBlocked: boolean
}) => {
  const address = useAccount('evm')
  const { data, isLoading, error } = useLegalCheck({ address })
  return (
    <div
      data-blocked={
        isGeoBlocked || (!data?.ipAllowed && !isLoading && !error)
          ? 'true'
          : 'false'
      }
      className="hidden data-[blocked=true]:block data-[blocked=true]:animate-slide fixed w-screen top-[56px] z-[11] flexitems-center justify-center bg-background"
    >
      <Message
        variant="destructive"
        className="!p-3 !text-xs !rounded-md !text-red-200 border border-red/50 mx-1"
      >
        You are accessing our products and services from a restricted
        jurisdiction. We do not allow access from certain jurisdictions
        including locations subject to sanctions restrictions and other
        jurisdictions where our services are ineligible for use. For more
        information, see our{' '}
        <LinkExternal href="/legal/terms-of-service">
          <span className="!text-red-200 underline">Terms of Use</span>
        </LinkExternal>
        . If you think this is an error, try refreshing the page or opening a
        support ticket.
      </Message>
    </div>
  )
}
