import { Disclosure, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CurrencyAmount } from '@sushiswap/core-sdk'
import CloseIcon from 'app/components/CloseIcon'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import QuestionHelper from 'app/components/QuestionHelper'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import { useKashiMarket } from 'app/features/kashi/KashiMarket'
import { classNames, unwrappedToken } from 'app/functions'
import React, { FC, Fragment } from 'react'

interface KashiMarketRepayClosePositionView {
  enabled: boolean
  onSwitch(): void
  setRemoveAmount(x: string): void
  setRepayAmount(x: string): void
}

export const KashiMarketRepayClosePositionView: FC<KashiMarketRepayClosePositionView> = ({
  enabled,
  onSwitch,
  setRepayAmount,
  setRemoveAmount,
}) => {
  const { i18n } = useLingui()
  const { market } = useKashiMarket()

  const repayAmount = CurrencyAmount.fromRawAmount(unwrappedToken(market.asset.token), market.currentUserBorrowAmount)
  const removeAmount = CurrencyAmount.fromRawAmount(
    unwrappedToken(market.collateral.token),
    market.userCollateralAmount
  )

  return (
    <Disclosure as="div">
      {({ open }) => (
        <div
          className={classNames(
            open ? 'bg-dark-900' : '',
            'shadow-inner flex flex-col gap-2 py-2 rounded px-2 border border-dark-700 transition hover:border-dark-700'
          )}
        >
          <div className="flex justify-between gap-2 items-center pl-1">
            <div className="flex gap-3 items-center">
              <Typography variant="xs" weight={700} className="flex -ml-1 gap-2">
                <QuestionHelper
                  text={
                    <div className="flex flex-col gap-2">
                      <Typography variant="xs" className="text-white">
                        {i18n._(t`Close your position by swapping your collateral for the borrowed asset`)}
                      </Typography>
                    </div>
                  }
                />
                {i18n._(t`Close Position`)}
              </Typography>
              <Switch
                size="sm"
                id="toggle-expert-mode-button"
                checked={enabled}
                onChange={onSwitch}
                checkedIcon={<CheckIcon className="text-dark-700" />}
                uncheckedIcon={<CloseIcon />}
                color="gradient"
              />
            </div>

            <Disclosure.Button as={Fragment}>
              <div className="flex flex-grow items-center justify-end p-1 cursor-pointer rounded">
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
            <Disclosure.Panel static className="px-2 pb-2 pt-1">
              <div className="rounded flex flex-col gap-2">
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => setRemoveAmount(removeAmount?.toExact())}
                >
                  <CurrencyLogo currency={market.collateral.token} size={20} />
                  <Typography variant="sm" weight={700}>
                    Collateral {removeAmount.toSignificant(6)} {removeAmount.currency.symbol}
                  </Typography>
                </div>
                <div
                  className="flex gap-2 items-center cursor-pointer"
                  onClick={() => setRepayAmount(repayAmount?.toExact())}
                >
                  <CurrencyLogo currency={market.asset.token} size={20} />
                  <Typography variant="sm" weight={700}>
                    Borrowed {repayAmount.toSignificant(6)} {repayAmount.currency.symbol}
                  </Typography>
                </div>
              </div>
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
