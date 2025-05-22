import { InboxItem } from './inbox-item'

export const Product = () => {
  // @ DEV use PortfolioInfoRowSkeleton for loading state
  return (
    <div className="flex flex-col gap-4">
      {/* <div className="text-center text-sm italic text-muted-foreground">You haven&apos;t received any notifications so far.</div> */}
      <InboxItem
        type="product"
        details="Give Sushi's new swap update a try."
        date="2025-01-08"
      />
    </div>
  )
}
