import { ArrowLongRightIcon } from '@heroicons/react/20/solid'
import { classNames } from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui/future/components/Dots'
import React, { FC } from 'react'

interface ConfirmationDialogContent {
  txHash?: string
}

export const ConfirmationDialogContent: FC<ConfirmationDialogContent> = ({ txHash }) => {
  if ('') {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
        Please sign order with your wallet.
      </h1>
    )
  }
  if ('') {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center leading-normal">
        Waiting for your{' '}
        <a
          target="_blank"
          className={classNames(txHash ? 'text-blue' : 'pointer-events-none', 'hover:underline cursor-pointer')}
          rel="noreferrer"
        >
          <Dots>transaction</Dots>
        </a>
        {''}
        to be confirmed on <div className="min-w-4 min-h-4"></div>{' '}
      </h1>
    )
  }
  if ('') {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
        <span className="text-red">Oops!</span> Your{' '}
        <span className="text-blue hover:underline cursor-pointer">transaction</span> failed
      </h1>
    )
  }
  if ('') {
    return (
      <div className="flex flex-col justify-center gap-3">
        <span className="flex flex-wrap whitespace-nowrap justify-center gap-1 font-medium text-lg items-center">
          You sold
          <a target="_blank" className="text-red px-0.5 font-semibold" rel="noreferrer"></a>
          {''}
          for
          <a target="_blank" className="text-blue px-0.5 font-semibold" rel="noreferrer"></a>
        </span>
        <span className="text-lg text-center justify-center flex items-center gap-3">
          <ArrowLongRightIcon width={24} height={24} className="text-gray-300 dark:text-slate-500" />
        </span>
      </div>
    )
  } else {
    return (
      <h1 className="flex flex-wrap justify-center gap-1 font-medium text-lg items-center">
        Sent
        <a target="_blank" className="text-blue hover:underline cursor-pointer" rel="noreferrer">
          <span className="text-blue px-0.5 font-semibold"></span>
          {''}
        </a>
        to {}
      </h1>
    )
  }
  return <span />
}
