import { Button, Message } from '@sushiswap/ui'
import { useCreateTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'

interface TrustlineWarningProps {
  assetCode: string
  assetIssuer: string
  className?: string
  direction?: 'input' | 'output'
}

export const TrustlineWarning = ({
  assetCode,
  assetIssuer,
  className,
  direction = 'output',
}: TrustlineWarningProps) => {
  const createTrustline = useCreateTrustline()

  const handleCreateTrustline = () => {
    createTrustline.mutate({
      assetCode,
      assetIssuer,
    })
  }

  const description =
    direction === 'input'
      ? `To swap with ${assetCode}, you need to create a trustline first. This is a one-time setup for this asset.`
      : `To receive ${assetCode}, you need to create a trustline first. This is a one-time setup for this asset.`

  return (
    <Message variant="warning" className={className} size="sm">
      <div className="flex flex-col gap-2">
        <p className="font-semibold">⚠️ Trustline Required</p>
        <p className="text-sm">{description}</p>
        <Button
          size="sm"
          onClick={handleCreateTrustline}
          loading={createTrustline.isPending}
          disabled={createTrustline.isPending}
          className="w-fit"
        >
          {createTrustline.isPending
            ? 'Creating Trustline...'
            : 'Create Trustline'}
        </Button>
      </div>
    </Message>
  )
}
