import { InboxItem } from './inbox-item'

export const AllInbox = () => {
  // @ DEV use PortfolioInfoRowSkeleton for loading state
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="text-center text-sm italic text-muted-foreground">You haven&apos;t received any notifications so far.</div> */}
      <InboxItem
        type="add-liquidity"
        details="Added 0.5 ETH and 1,123 USDC"
        date="2025-01-08"
      />
      <InboxItem
        type="remove-liquidity"
        details="Removed 0.2 ETH and 1,123 USDC"
        date="2025-01-08"
      />
      <InboxItem
        type="dca"
        details="1.085 ETH for 1,666.11 USDC"
        date="2025-01-08"
      />
      <InboxItem
        isRead={true}
        type="market"
        details="1.085 ETH for 1,666.11 USDC"
        date="2025-01-08"
      />
      <InboxItem
        isRead={true}
        type="product"
        details="Give Sushi's new swap update a try."
        date="2025-01-08"
      />
      <InboxItem
        isRead={true}
        type="reward-claimed"
        details="Claimed 435 SUSHI"
        date="2025-01-08"
      />
      <InboxItem
        isRead={true}
        type="limit"
        details="1.085 ETH for 1,666.11 USDC"
        date="2025-01-08"
      />
    </div>
  )
}
