import { ExternalLinkIcon } from '@heroicons/react/outline'
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/solid'
import { CircleIcon, classNames, Loader, Popover, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { FC, ReactNode } from 'react'

type TransactionProgressStepHeader = { children: ReactNode }
const TransactionProgressStepHeader: FC<TransactionProgressStepHeader> = ({ children }) => {
  return (
    <Typography variant="sm" className="text-inherit group-hover:text-inherit">
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
  status: 'failed' | 'success' | 'pending' | 'idle' | 'skipped' | 'notice'
  header: ReactNode
  subheader: ReactNode
  lastStep?: boolean
  link?: string
  comingSoon?: boolean
}

type TransactionProgressStepType<P> = FC<P> & {
  Header: FC<TransactionProgressStepHeader>
  SubHeader: FC<TransactionProgressStepSubHeader>
}

export const TransactionProgressStep: TransactionProgressStepType<TransactionProgressStep> = ({
  status,
  header,
  subheader,
  lastStep = false,
  link,
  comingSoon = false,
}) => {
  return (
    <div className={classNames('grid grid-cols-[60px_320px] mx-auto')}>
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 flex justify-center items-center">
          {status === 'pending' && <Loader width={21} height={21} />}
          {status === 'success' && <CheckCircleIcon className="text-blue" width={24} height={24} />}
          {status === 'skipped' && (
            <Popover
              hover
              button={<ExclamationCircleIcon className="text-slate-500 hover:text-slate-300" width={24} height={24} />}
              panel={
                <div className="bg-slate-800 border border-slate-200/10 p-3 text-xs rounded-2xl">
                  <b>Skipped</b> due to an earlier failure.
                </div>
              }
            />
          )}
          {status === 'idle' && <CircleIcon className="text-slate-500" width={24} height={24} />}
          {status === 'failed' && (
            <Popover
              hover
              button={<XCircleIcon className="text-red" width={24} height={24} />}
              panel={
                <div className="bg-slate-800 border border-slate-200/10 p-3 text-xs rounded-2xl">
                  Transaction Failed
                </div>
              }
            />
          )}
          {status === 'notice' && (
            <Popover
              hover
              button={<ExclamationCircleIcon className="text-yellow" width={24} height={24} />}
              panel={
                <div className="bg-slate-800 border border-slate-200/10 p-3 text-xs rounded-2xl">
                  Non expected result.
                </div>
              }
            />
          )}
        </div>
        {!lastStep && (
          <div
            className={classNames(
              status === 'success'
                ? 'border-blue'
                : status === 'failed'
                ? 'border-red'
                : status === 'notice'
                ? 'border-yellow'
                : 'border-slate-600',
              'transition-all h-12 w-0 border-dashed border-l-2 my-2'
            )}
          />
        )}
      </div>
      <div
        className={classNames(
          ['idle', 'skipped'].includes(status) ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col gap-1 mt-0.5'
        )}
      >
        {link ? (
          <Link href={link} passHref={true}>
            <a target="_blank" className={classNames('text-slate-200', 'flex items-center gap-1 hover:text-slate-50')}>
              {header}
              <ExternalLinkIcon width={16} className="text-inherit" />
            </a>
          </Link>
        ) : comingSoon ? (
          <div className="text-slate-200 flex items-center gap-1 hover:text-slate-50">
            {header}{' '}
            <Popover
              hover
              button={<ExternalLinkIcon width={16} className="text-inherit opacity-40" />}
              panel={
                <div className="bg-slate-800 border border-slate-200/10 p-3 text-xs rounded-2xl">
                  LzScan coming soon!
                </div>
              }
            />
          </div>
        ) : (
          <div className="text-slate-200">{header}</div>
        )}
        {subheader}
      </div>
    </div>
  )
}

TransactionProgressStep.Header = TransactionProgressStepHeader
TransactionProgressStep.SubHeader = TransactionProgressStepSubHeader
