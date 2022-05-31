import { ChevronDownIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import Button from 'app/components/Button'
import { CurrencyLogo } from 'app/components/CurrencyLogo'
import ListPanel from 'app/components/ListPanel'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import { useUSDCValue } from 'app/hooks/useUSDCPrice'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import { useActiveWeb3React } from 'app/services/web3'
import { useBentoBalanceV2 } from 'app/state/bentobox/hooks'
import { useTokenBalance } from 'app/state/wallet/hooks'
import Lottie from 'lottie-react'
import React, { FC, ReactNode, useState } from 'react'

interface AssetSelectProps {
  title?: string
  value?: Currency
  onSelect: (x: Currency) => void
  header?: ReactNode
  currencies?: (Currency | undefined)[]
}

const AssetSelect = (props: AssetSelectProps) => {
  const { i18n } = useLingui()

  let header = props.header || (
    <Typography variant="h3" weight={700} className="mb-4 text-high-emphesis">
      {props.title ? props.title : i18n._(t`Choose an asset to Receive:`)}
    </Typography>
  )

  return (
    <div className="relative z-10 flex flex-col mt-4">
      {header}
      <AssetSelectPanel value={props.value} onSelect={props.onSelect} currencies={props.currencies} />
    </div>
  )
}

interface AssetSelectPanelProps extends AssetSelectProps {}

const AssetSelectPanel: FC<AssetSelectPanelProps> = ({ value, onSelect, currencies }) => {
  const { i18n } = useLingui()
  const [open, setOpen] = useState(false)
  const [balances, setBalances] = useState(false)

  let content = (
    <div className="flex flex-row items-center gap-1" onClick={() => setOpen(true)}>
      <div className="flex items-center w-12 h-12 rounded-full">
        <Lottie animationData={selectCoinAnimation} autoplay loop />
      </div>
      <div className="inline-flex">
        <Button
          color="blue"
          size="sm"
          variant="filled"
          className="!rounded-full"
          endIcon={<ChevronDownIcon width={24} height={24} />}
        >
          {i18n._(t`Select a Token`)}
        </Button>
      </div>
    </div>
  )

  if (value) {
    content = (
      <div className="flex flex-grow gap-0.5 items-center justify-between">
        <div className="flex flex-row cursor-pointer items-center gap-0.5" onClick={() => setOpen(true)}>
          <div className="w-[38px] h-[38px] rounded-full overflow-hidden mr-2.5">
            <CurrencyLogo currency={value} size={38} />
          </div>
          <Typography variant="h3" weight={700} className="text-high-emphesis">
            {value.symbol}
          </Typography>
          <ChevronDownIcon width={24} height={24} className="text-secondary" />
        </div>
        <Typography
          variant="xs"
          className="cursor-pointer text-blue"
          onClick={() => setBalances((prevState) => !prevState)}
        >
          {balances ? i18n._(t`Hide Balances`) : i18n._(t`Show Balances`)}
        </Typography>
      </div>
    )
  }

  return (
    <>
      <div
        className={classNames(
          'border rounded border-dark-700 bg-dark-900 flex flex-col overflow-hidden h-[68px] justify-center pl-2 pr-3'
        )}
      >
        {content}
        <CurrencySearchModal.Controlled
          open={open}
          onDismiss={() => setOpen(false)}
          selectedCurrency={value}
          onCurrencySelect={onSelect}
          currencyList={currencies?.map((el) => el?.wrapped.address)}
        />
      </div>
      {value && balances && (
        <div className="mt-4">
          <BalancePanel currency={value} />
        </div>
      )}
    </>
  )
}

const BalancePanel = ({ currency }: { currency: Currency }) => {
  const { account } = useActiveWeb3React()
  const { i18n } = useLingui()
  const { data: balance } = useBentoBalanceV2(currency?.wrapped.address)
  const bentoUSDC = useUSDCValue(balance)
  const wallet = useTokenBalance(account ?? undefined, currency?.wrapped)
  const walletUSDC = useUSDCValue(wallet)

  return (
    <ListPanel
      items={[
        <div className="flex grid items-center grid-cols-2 gap-2 px-4 h-11 border-dark-700" key={0}>
          <div className="flex flex-row items-center gap-1.5">
            <div className="flex items-center justify-center rounded-full overflow-hidden border border-dark-700 bg-dark-900 p-1.5 shadow-md">
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.59208 8.61864H0.669371C0.300101 8.61864 0 8.29978 0 7.90744V0.711207C0 0.318858 0.300101 0 0.669371 0H9.59208C9.96136 0 10.2615 0.318858 10.2615 0.711207V2.31616H7.05851C6.81866 2.31616 6.58438 2.36713 6.3646 2.46552C6.15263 2.56035 5.96187 2.69785 5.79898 2.87091C5.63611 3.04397 5.50669 3.24666 5.41744 3.47188C5.32373 3.70539 5.27687 3.95431 5.27687 4.20916V4.40948C5.27687 4.66433 5.32484 4.91326 5.41744 5.14677C5.50669 5.37198 5.6361 5.57469 5.79898 5.74775C5.96186 5.9208 6.15263 6.0583 6.3646 6.15313C6.58438 6.25271 6.81866 6.30248 7.05851 6.30248H10.2615V7.90744C10.2615 8.29979 9.96136 8.61864 9.59208 8.61864ZM10.498 3.02728C10.7758 3.02728 11.0001 3.26554 11.0001 3.56069V5.05777C11.0001 5.35292 10.7758 5.59117 10.498 5.59117H10.2615H7.05858C6.44387 5.59117 5.94631 5.06252 5.94631 4.4094V4.20907C5.94631 3.55595 6.44386 3.02728 7.05858 3.02728H10.2615H10.498ZM6.64915 4.30864C6.64915 4.65596 6.91355 4.93687 7.24042 4.93687C7.5673 4.93687 7.8317 4.65596 7.8317 4.30864C7.8317 3.96134 7.5673 3.68041 7.24042 3.68041C6.91355 3.68041 6.64915 3.96134 6.64915 4.30864Z"
                  fill="#E3E3E3"
                />
              </svg>
            </div>
            <Typography variant="xs" weight={400} className="text-secondary">
              {i18n._(t`In Wallet:`)}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {wallet?.greaterThan('0') ? wallet?.toSignificant(6) : '0.0000'}
            </Typography>
          </div>
          <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
            ≈${walletUSDC?.greaterThan('0') ? walletUSDC.toSignificant(6) : '0.0000'}
          </Typography>
        </div>,
        <div className="flex grid items-center grid-cols-2 gap-2 px-4 h-11 border-dark-700" key={1}>
          <div className="flex flex-row items-center gap-1.5">
            <div className="flex items-center justify-center rounded-full overflow-hidden border border-dark-700 bg-dark-900 p-1.5 shadow-md">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.67642 0H3.82346V2.94117H5.14699C5.87682 2.94117 6.47052 3.53487 6.47052 4.2647V5.58822H9.99993V1.32353C9.99996 0.593708 9.40625 0 8.67642 0ZM5.14699 3.82391H3.82346V5.58862H5.58818V4.26509C5.58818 4.02183 5.39026 3.82391 5.14699 3.82391ZM0 8.67649V6.47061H4.70588V10H1.32353C0.593708 10 0 9.40631 0 8.67649ZM5.58816 6.47061V10H8.6764C9.40622 10 9.99993 9.40631 9.99993 8.67649V6.47061H5.58816ZM0 1.32353C0 0.593708 0.593708 0 1.32353 0H2.94117V5.58822H0V1.32353Z"
                  fill="#E3E3E3"
                />
              </svg>
            </div>
            <Typography variant="xs" weight={400} className="text-secondary">
              {i18n._(t`In Bento:`)}
            </Typography>
            <Typography variant="sm" weight={700} className="text-high-emphesis">
              {balance?.greaterThan('0') ? balance?.toSignificant(6) : '0.0000'}
            </Typography>
          </div>
          <Typography variant="sm" weight={700} className="text-right text-high-emphesis">
            ≈${bentoUSDC?.greaterThan('0') ? bentoUSDC.toSignificant(6) : '0.0000'}
          </Typography>
        </div>,
      ]}
    />
  )
}

AssetSelect.Panel = AssetSelectPanel
AssetSelect.BalancePanel = BalancePanel

export default AssetSelect
