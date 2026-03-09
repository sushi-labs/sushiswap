'use client'
import { LinkInternal, Message } from '@sushiswap/ui'

export const GeoBlockedMessage = ({
  isGeoBlocked,
}: {
  isGeoBlocked: boolean
}) => {
  return (
    <div
      data-blocked={isGeoBlocked ? 'true' : 'false'}
      className="hidden data-[blocked=true]:block data-[blocked=true]:animate-slide"
    >
      <Message variant="destructive">
        You are accessing our products and services from a restricted
        jurisdiction. We do not allow access from certain jurisdictions
        including locations subject to sanctions restrictions and other
        jurisdictions where our services are ineligible for use. For more
        information, see our{' '}
        <LinkInternal href="#todo" className="underline">
          Terms of Use
        </LinkInternal>
        . If you think this is an error, try refreshing the page or opening a
        support ticket.
      </Message>
    </div>
  )
}
