import { InformationCircleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  type ButtonProps,
  CardDescription,
  CardHeader,
  CardTitle,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@sushiswap/ui'
import { useState } from 'react'
import { useCreateTrustline } from '~stellar/_common/lib/hooks/trustline/use-trustline'

interface CreateTrustlineButtonProps extends ButtonProps {
  tokens: Array<{ code: string; issuer: string }>
}

export const CreateTrustlineButton = ({
  tokens,
  ...rest
}: CreateTrustlineButtonProps) => {
  const createTrustline = useCreateTrustline()
  const [creatingTrustlines, setCreatingTrustlines] = useState(false)

  const handleCreateTrustlines = async () => {
    if (tokens.length === 0) {
      return
    }
    try {
      setCreatingTrustlines(true)
      for (const token of tokens) {
        await createTrustline.mutateAsync({
          assetCode: token.code,
          assetIssuer: token.issuer,
        })
      }
    } finally {
      setCreatingTrustlines(false)
    }
  }

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <Button
        onClick={handleCreateTrustlines}
        loading={creatingTrustlines}
        disabled={creatingTrustlines}
        {...rest}
      >
        {creatingTrustlines ? 'Creating Trustline...' : 'Create Trustline'}
        <HoverCardTrigger>
          <InformationCircleIcon width={16} height={16} />
        </HoverCardTrigger>
      </Button>
      <HoverCardContent className="!p-0 max-w-[320px]">
        <CardHeader>
          <CardTitle>
            Create Trustline{tokens.length === 1 ? '' : 's'}
          </CardTitle>
          <CardDescription>
            Please create a trustline in order to interact with the following
            asset{tokens.length === 1 ? '' : 's'}:{' '}
            {tokens.map((token) => `${token.code}`).join(', ')}. This is a
            one-time setup per asset.
          </CardDescription>
        </CardHeader>
      </HoverCardContent>
    </HoverCard>
  )
}
