import { ExternalLinkIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid'
import chain, { ChainId } from '@sushiswap/chain'
import { classNames, HalfCircleIcon, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

type TransactionProgressStepHeader = { children: ReactNode }
const TransactionProgressStepHeader: FC<TransactionProgressStepHeader> = ({ children }) => {
  return (
    <Typography variant="xs" className="text-inherit group-hover:text-inherit">
      {children}
    </Typography>
  )
}

type TransactionProgressStepSubHeader = { icon: ReactNode; caption: ReactNode }
const TransactionProgressStepSubHeader: FC<TransactionProgressStepSubHeader> = ({ icon, caption }) => {
  return (
    <Typography variant="xs" className="flex gap-2 text-slate-500 items-center">
      {icon}
      {caption}
    </Typography>
  )
}

interface TransactionProgressStep {
  status: 'failed' | 'success' | 'pending'
  header: ReactNode
  subheader: ReactNode
  txHash: string
  lastStep?: boolean
}

type TransactionProgressStepType<P> = FC<P> & {
  Header: FC<TransactionProgressStepHeader>
  SubHeader: FC<TransactionProgressStepSubHeader>
}

export const TransactionProgressStep: TransactionProgressStepType<TransactionProgressStep> = ({
  txHash,
  status,
  header,
  subheader,
  lastStep = false,
}) => {
  return (
    <div className={classNames('grid grid-cols-[40px_260px] mx-auto')}>
      <div className="flex flex-col items-center">
        <div className="w-4 h-4 flex justify-center items-center">
          {status === 'pending' && <HalfCircleIcon className="text-blue" width={13} height={13} />}
          {status === 'success' && <CheckCircleIcon className="text-slate-500" width={16} height={16} />}
          {status === 'failed' && <ExclamationCircleIcon className="text-yellow" width={16} height={16} />}
        </div>
        {!lastStep && <div className="h-6 w-0 border-dashed border-l-2 my-2 border-slate-600" />}
      </div>
      <div className="flex flex-col gap-1">
        <Link href={chain[ChainId.ETHEREUM].getTxUrl(txHash)} passHref={true}>
          <a
            target="_blank"
            className={classNames(
              status === 'success' ? 'text-slate-500' : 'text-slate-200',
              'flex items-center gap-1 hover:text-slate-50'
            )}
          >
            {header}
            <ExternalLinkIcon width={16} className="text-inherit" />
          </a>
        </Link>
        <Typography variant="xs" className="flex gap-2 text-slate-500 items-center">
          {subheader}
        </Typography>
      </div>
    </div>
  )
}

TransactionProgressStep.Header = TransactionProgressStepHeader
TransactionProgressStep.SubHeader = TransactionProgressStepSubHeader
