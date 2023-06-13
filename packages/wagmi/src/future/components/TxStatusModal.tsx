import { FC } from 'react'
import { Address, useWaitForTransaction } from 'wagmi'
import { Chain, ChainId } from '@sushiswap/chain'
import { BarLoader } from '@sushiswap/ui/future/components/BarLoader'
import { Loader } from '@sushiswap/ui/future/components/Loader'
import { CheckMarkIcon } from '@sushiswap/ui/future/components/icons/CheckmarkIcon'
import { FailedMarkIcon } from '@sushiswap/ui/future/components/icons/FailedMarkIcon'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import { Button } from '@sushiswap/ui/future/components/button'

interface TxStatusModalContentProps {
  testId: string
  tag: string
  chainId: ChainId
  hash: Address | undefined
  onComplete?(): void
  onClose(): void
  successMessage: string
  buttonSuccessText?: string
  buttonSuccessLink?: string
}

export const TxStatusModalContent: FC<TxStatusModalContentProps> = ({
  testId,
  onComplete,
  chainId,
  hash,
  successMessage,
  buttonSuccessText,
  buttonSuccessLink,
  onClose,
}) => {
  const { status } = useWaitForTransaction({ chainId, hash })

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      {['error', 'success'].includes(status) ? (
        <BarLoader transitionDuration={4000} onComplete={onComplete} />
      ) : (
        <div className="h-1" />
      )}
      <div className="py-5">
        {status === 'loading' ? (
          <Loader size={100} strokeWidth={1} className="!text-blue" />
        ) : status === 'success' ? (
          <CheckMarkIcon width={100} height={100} />
        ) : (
          <FailedMarkIcon width={100} height={100} />
        )}
      </div>
      <div className="flex flex-col items-center">
        {status === 'loading' ? (
          <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-medium leading-normal">
            Waiting for your{' '}
            <a
              target="_blank"
              href={hash ? Chain.from(chainId).getTxUrl(hash) : ''}
              className="cursor-pointer text-blue hover:underline"
              rel="noreferrer"
            >
              <Dots>transaction</Dots>
            </a>{' '}
            to be confirmed on the blockchain.
          </h1>
        ) : status === 'success' ? (
          <h1 className="flex flex-wrap items-center justify-center text-center gap-1 text-lg font-semibold">
            {successMessage}
          </h1>
        ) : (
          <h1 className="flex flex-wrap items-center justify-center gap-1 text-lg font-semibold">
            <span className="text-red">Oops!</span> Your{' '}
            <span className="cursor-pointer text-blue hover:underline">transaction</span> failed
          </h1>
        )}
      </div>
      <Button
        {...(buttonSuccessLink ? { as: 'a', href: buttonSuccessLink } : { onClick: onClose })}
        fullWidth
        color="blue"
        variant="outlined"
        size="xl"
        testId={testId}
      >
        {status === 'success'
          ? buttonSuccessText
            ? buttonSuccessText
            : 'Close'
          : status === 'error'
          ? 'Try again'
          : 'Close'}
      </Button>
    </div>
  )
}
