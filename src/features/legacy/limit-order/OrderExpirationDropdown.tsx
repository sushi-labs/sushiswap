import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import QuestionHelper from 'app/components/QuestionHelper'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useAppDispatch } from 'app/state/hooks'
import { setOrderExpiration } from 'app/state/limit-order/actions'
import { useLimitOrderState } from 'app/state/limit-order/hooks'
import { OrderExpiration } from 'app/state/limit-order/reducer'
import React, { FC, Fragment, useCallback, useMemo } from 'react'

const OrderExpirationDropdown: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  const { orderExpiration } = useLimitOrderState()
  const items = useMemo(
    () => ({
      [OrderExpiration.never]: i18n._(t`Never`),
      [OrderExpiration.hour]: i18n._(t`1 Hour`),
      [OrderExpiration.day]: i18n._(t`24 Hours`),
      [OrderExpiration.week]: i18n._(t`1 Week`),
      [OrderExpiration.month]: i18n._(t`30 Days`),
    }),
    [i18n]
  )

  const handler = useCallback(
    (e, item) => {
      dispatch(
        setOrderExpiration({
          // @ts-ignore TYPE NEEDS FIXING
          label: items[item],
          value: item,
        })
      )
    },
    [dispatch, items]
  )

  return (
    <div className="flex flex-col flex-grow gap-1">
      <Typography variant="sm" className="flex items-center px-2">
        {i18n._(t`Expires in`)}
        <QuestionHelper text={i18n._(t`Expiration is the time at which the order will become invalid`)} />
      </Typography>
      <div className="flex items-center justify-between h-full px-4 py-2 border rounded bg-dark-900 border-dark-700 hover:border-dark-600">
        <Menu as="div" className="relative inline-block w-full text-left">
          <Menu.Button className="w-full">
            <div className="flex flex-row items-center justify-between">
              <Typography weight={700} variant="sm">
                {orderExpiration.label}
              </Typography>
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute z-10 w-full mt-2 overflow-auto border rounded shadow-lg bg-dark-900 border-dark-700 hover:border-dark-600"
            >
              {Object.entries(items).map(([k, v]) => {
                return (
                  <Menu.Item key={k} onClick={(e) => handler(e, k)}>
                    {({ active }) => {
                      return (
                        <Typography
                          variant="sm"
                          weight={700}
                          className={classNames(
                            active ? 'text-white' : 'text-primary',
                            'px-3 py-2 cursor-pointer hover:bg-dark-900/40'
                          )}
                        >
                          {v}
                        </Typography>
                      )
                    }}
                  </Menu.Item>
                )
              })}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default OrderExpirationDropdown
