import { Disclosure, Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/outline'
import { BadgeCheckIcon, ChevronDoubleRightIcon, EmojiHappyIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import ExternalLink from 'app/components/ExternalLink'
import Loader from 'app/components/Loader'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { PrivateTxState } from 'app/entities/SushiGuard'
import { classNames, formatDateAgo, getExplorerLink } from 'app/functions'
import { isTxPending } from 'app/functions/transactions'
import { TransactionDetails } from 'app/state/transactions/reducer'
import React, { FC, Fragment } from 'react'

import { useActiveWeb3React } from '../../services/web3/hooks/useActiveWeb3React'

interface PrivateTransaction {
  tx: TransactionDetails
}

const PrivateTransaction: FC<PrivateTransaction> = ({ tx }) => {
  const { i18n } = useLingui()
  const { chainId } = useActiveWeb3React()

  const summary = tx?.summary
  const privateTx = tx?.privateTx
  const pending = isTxPending(tx)
  const indeterminate = tx?.privateTx?.state === PrivateTxState.INDETERMINATE ?? false
  const error = tx?.privateTx?.state === PrivateTxState.ERROR ?? false
  const success =
    !pending &&
    !indeterminate &&
    !error &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const cancelled = tx?.receipt && tx.receipt.status === 1337

  console.log(privateTx)

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div className={classNames(open ? 'bg-dark-900 py-1' : '', 'shadow-inner flex flex-col gap-2 rounded')}>
          <div
            className={classNames(
              open ? 'border-b border-dark-800 pb-1' : '',
              'flex items-center justify-between gap-2'
            )}
          >
            <div className="flex flex-col w-full py-1">
              <div className="flex gap-1">
                <ExternalLink
                  href={getExplorerLink(chainId, tx.hash, 'transaction')}
                  className="flex items-center gap-2"
                >
                  <div
                    className={classNames(
                      pending
                        ? 'text-primary'
                        : success
                        ? 'text-green'
                        : indeterminate
                        ? 'text-yellow'
                        : cancelled
                        ? 'text-red'
                        : 'text-red'
                    )}
                  >
                    {pending ? (
                      <Loader />
                    ) : success ? (
                      <CheckCircleIcon width={16} height={16} />
                    ) : cancelled ? (
                      <XCircleIcon width={16} height={16} />
                    ) : (
                      <ExclamationIcon width={16} height={16} />
                    )}
                  </div>
                  <Typography variant="xs" weight={700} className="flex gap-1 items-center hover:underline py-0.5">
                    {summary ?? tx.hash}
                  </Typography>
                </ExternalLink>

                {privateTx && (
                  <>
                    <QuestionHelper
                      text={i18n._(t`This transaction has been sent using SushiGuard`)}
                      icon={<ShieldCheckIcon className="text-green" width={14} />}
                    />

                    {privateTx.status && (
                      <>
                        {privateTx.status.receivedAt && (
                          <QuestionHelper
                            text={i18n._(t`Transaction successfully received by SushiGuard`)}
                            icon={<BadgeCheckIcon className="text-green" width={14} />}
                          />
                        )}

                        {privateTx.status.relayedAt && (
                          <>
                            <QuestionHelper
                              text={i18n._(t`Transaction relayed by SushiGuard to downstream miners`)}
                              icon={
                                <ChevronDoubleRightIcon
                                  className={privateTx.status.relayFailure ? 'text-red' : 'text-green'}
                                  width={14}
                                />
                              }
                            />
                          </>
                        )}

                        {privateTx.status.minedAt && (
                          <QuestionHelper
                            text={i18n._(t`Transaction mined sucessfully`)}
                            icon={<EmojiHappyIcon className="text-green" width={14} />}
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <Disclosure.Button as={Fragment}>
              <div className="flex items-center justify-end flex-grow p-1 rounded cursor-pointer">
                <ChevronDownIcon
                  width={20}
                  className={classNames(open ? 'transform rotate-180' : '', 'transition hover:text-white')}
                />
              </div>
            </Disclosure.Button>
          </div>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            unmount={false}
          >
            <Disclosure.Panel static className="px-1 flex flex-col gap-2 pb-1">
              <PrivateTransactionStep
                completed={Boolean(privateTx?.status?.receivedAt && privateTx?.status?.relayedAt)}
                timestamp={privateTx?.status?.receivedAt}
                text={i18n._(t`Tx received by SushiGuard`)}
              />
              <PrivateTransactionStep
                completed={Boolean(privateTx?.status?.relayedAt && privateTx?.status?.minedAt)}
                timestamp={privateTx?.status?.relayedAt}
                text={`${i18n._(t`Tx relayed by SushiGuard`)} ${
                  privateTx?.status?.relayedAt ? (privateTx?.status?.relayFailure ? '(failed)' : '(success)') : ''
                }`}
                error={privateTx?.status?.relayFailure}
              >
                {privateTx?.status?.relayResponses && (
                  <div className="flex flex-col gap-1">
                    <Typography
                      variant="xxs"
                      className="text-mono overflow-auto p-2 bg-dark-1000/40 rounded border border-dark-800"
                    >
                      <pre>{JSON.stringify(privateTx?.status?.relayResponses, null, 2)}</pre>
                    </Typography>
                  </div>
                )}
              </PrivateTransactionStep>
              <PrivateTransactionStep
                timestamp={privateTx?.status?.minedAt}
                text={i18n._(t`Tx mined successfully`)}
                bordered={false}
              />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}

const PrivateTransactionStep: FC<{
  timestamp?: string
  text?: string
  bordered?: boolean
  completed?: boolean
  error?: boolean
}> = ({ timestamp, text, bordered = true, children, completed = false, error = false }) => {
  return (
    <div className="flex flex-col relative">
      {bordered && (
        <div
          className={classNames(
            completed ? 'bg-blue/20' : 'bg-dark-700/20',
            'absolute w-px h-full bg-blue top-[12px] ml-[4px]'
          )}
        />
      )}
      <div className="flex gap-3 items-center">
        <div className={classNames(timestamp ? 'bg-blue' : 'bg-dark-700', 'w-[9px] h-[9px] rounded-full')} />
        <Typography
          variant="xs"
          weight={700}
          className={classNames(
            timestamp ? '' : 'opacity-40',
            error ? 'text-red' : 'text-high-emphesis',
            'items-baseline'
          )}
        >
          {text}
        </Typography>
      </div>
      {timestamp && (
        <div className="flex gap-3 items-center">
          <div className="w-[9px] h-[9px] rounded-full" />
          <Typography variant="xxs" className="text-secondary">
            {formatDateAgo(new Date(timestamp))}
          </Typography>
        </div>
      )}
      {children && (
        <div className="flex gap-3 items-center">
          <div className="w-[9px] h-[9px] rounded-full" />
          <div className="p-2 w-full flex flex-col gap-3">{children}</div>
        </div>
      )}
    </div>
  )
}

export default PrivateTransaction
