import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import { useAccount } from '@sushiswap/wagmi'
import { FC } from 'react'
import { ChainId } from 'sushi/chain'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

const ClaimSFuelButton = () => {
  const { address } = useAccount()
  return (
    <a
      href={
        address
          ? `https://www.sfuelstation.com/claim-sfuel/${address}`
          : 'https://www.sfuelstation.com/connect-wallet'
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        size="xl"
        variant="secondary"
        fullWidth
        icon={ArrowUpRightIcon}
        iconPosition="end"
      >
        Claim sFUEL
      </Button>
    </a>
  )
}

const AdditionalButton = {
  [ChainId.SKALE_EUROPA]: ClaimSFuelButton,
} as const

export const SimpleSwapAdditionalButton: FC = () => {
  const {
    state: { chainId },
  } = useDerivedStateSimpleSwap()

  return chainId in AdditionalButton ? (
    <div className="mt-4">
      {AdditionalButton[chainId as keyof typeof AdditionalButton]()}
    </div>
  ) : null
}
