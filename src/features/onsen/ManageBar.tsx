import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { MinusIcon, PlusIcon } from '@heroicons/react/solid'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { ChainId, MASTERCHEF_ADDRESS, MASTERCHEF_V2_ADDRESS, MINICHEF_ADDRESS, Token } from '@sushiswap/core-sdk'
import AssetInput from 'app/components/AssetInput'
import Button from 'app/components/Button'
import { HeadlessUiModal } from 'app/components/Modal'
import Switch from 'app/components/Switch'
import Typography from 'app/components/Typography'
import Web3Connect from 'app/components/Web3Connect'
import { OLD_FARMS } from 'app/config/farms'
import { useFarmListItemDetailsModal } from 'app/features/onsen/FarmListItemDetails'
import { setOnsenModalOpen } from 'app/features/onsen/onsenSlice'
import { classNames, tryParseAmount } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks/useApproveCallback'
import { useActiveWeb3React } from 'app/services/web3'
import { useAppDispatch } from 'app/state/hooks'
import { useTransactionAdder } from 'app/state/transactions/hooks'
import { useCurrencyBalance } from 'app/state/wallet/hooks'
import React, { useState } from 'react'

import { Chef, PairType } from './enum'
import { useUserInfo } from './hooks'
import useMasterChef from './useMasterChef'

const APPROVAL_ADDRESSES = {
  [Chef.MASTERCHEF]: { [ChainId.ETHEREUM]: MASTERCHEF_ADDRESS[ChainId.ETHEREUM] },
  [Chef.MASTERCHEF_V2]: { [ChainId.ETHEREUM]: MASTERCHEF_V2_ADDRESS[ChainId.ETHEREUM] },
  [Chef.MINICHEF]: {
    [ChainId.MATIC]: MINICHEF_ADDRESS[ChainId.MATIC],
    [ChainId.XDAI]: MINICHEF_ADDRESS[ChainId.XDAI],
    [ChainId.HARMONY]: MINICHEF_ADDRESS[ChainId.HARMONY],
    [ChainId.ARBITRUM]: MINICHEF_ADDRESS[ChainId.ARBITRUM],
    [ChainId.CELO]: MINICHEF_ADDRESS[ChainId.CELO],
    [ChainId.MOONRIVER]: MINICHEF_ADDRESS[ChainId.MOONRIVER],
    [ChainId.FUSE]: MINICHEF_ADDRESS[ChainId.FUSE],
    [ChainId.FANTOM]: MINICHEF_ADDRESS[ChainId.FANTOM],
  },
  [Chef.OLD_FARMS]: {
    [ChainId.CELO]: OLD_FARMS[ChainId.CELO],
  },
}

// @ts-ignore TYPE NEEDS FIXING
const ManageBar = ({ farm }) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useActiveWeb3React()
  const { setContent } = useFarmListItemDetailsModal()
  const [toggle, setToggle] = useState(true)
  const [depositValue, setDepositValue] = useState<string>()
  const [withdrawValue, setWithdrawValue] = useState<string>()
  const { deposit, withdraw } = useMasterChef(farm.chef)
  const addTransaction = useTransactionAdder()
  const liquidityToken = new Token(
    // @ts-ignore TYPE NEEDS FIXING
    chainId || 1,
    getAddress(farm.pair.id),
    farm.pair.type === PairType.KASHI ? Number(farm.pair.asset.decimals) : 18,
    farm.pair.type === PairType.KASHI ? 'KMP' : 'SLP'
  )
  const balance = useCurrencyBalance(account ?? undefined, liquidityToken)
  const stakedAmount = useUserInfo(farm, liquidityToken)
  const parsedDepositValue = tryParseAmount(depositValue, liquidityToken)
  const parsedWithdrawValue = tryParseAmount(withdrawValue, liquidityToken)
  // @ts-ignore TYPE NEEDS FIXING
  const [approvalState, approve] = useApproveCallback(parsedDepositValue, APPROVAL_ADDRESSES[farm.chef][chainId])

  const depositError = !parsedDepositValue
    ? 'Enter an amount'
    : balance?.lessThan(parsedDepositValue)
    ? 'Insufficient balance'
    : undefined
  const isDepositValid = !depositError
  const withdrawError = !parsedWithdrawValue
    ? 'Enter an amount'
    : // @ts-ignore TYPE NEEDS FIXING
    stakedAmount?.lessThan(parsedWithdrawValue)
    ? 'Insufficient balance'
    : undefined
  const isWithdrawValid = !withdrawError

  return (
    <>
      <HeadlessUiModal.BorderedContent className="flex flex-col gap-4 bg-dark-1000/40">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-high-emphesis">
              {toggle ? i18n._(t`Stake liquidity`) : i18n._(t`Unstake liquidity`)}
            </Typography>
            <Switch
              size="sm"
              checked={toggle}
              onChange={() => setToggle(!toggle)}
              checkedIcon={<PlusIcon className="text-dark-1000" />}
              uncheckedIcon={<MinusIcon className="text-dark-1000" />}
            />
          </div>

          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Use one of the buttons to set a percentage or enter a value manually using the input field`)}
          </Typography>
        </div>

        <div className="flex justify-end gap-2">
          {['25', '50', '75', '100'].map((multiplier, i) => (
            <Button
              variant="outlined"
              size="xs"
              color={toggle ? 'blue' : 'pink'}
              key={i}
              onClick={() => {
                toggle
                  ? balance
                    ? // @ts-ignore TYPE NEEDS FIXING
                      setDepositValue(balance.multiply(multiplier).divide(100).toExact())
                    : undefined
                  : stakedAmount
                  ? // @ts-ignore TYPE NEEDS FIXING
                    setWithdrawValue(stakedAmount.multiply(multiplier).divide(100).toExact())
                  : undefined
              }}
              className={classNames(
                'text-md border border-opacity-50',
                toggle ? 'focus:ring-blue border-blue' : 'focus:ring-pink border-pink'
              )}
            >
              {multiplier === '100' ? 'MAX' : multiplier + '%'}
            </Button>
          ))}
        </div>
        <AssetInput
          currencyLogo={false}
          currency={liquidityToken}
          value={toggle ? depositValue : withdrawValue}
          onChange={toggle ? setDepositValue : setWithdrawValue}
          balance={toggle ? undefined : stakedAmount}
          showMax={false}
        />
      </HeadlessUiModal.BorderedContent>
      {toggle ? (
        !account ? (
          <Web3Connect size="lg" color="blue" fullWidth />
        ) : isDepositValid &&
          (approvalState === ApprovalState.NOT_APPROVED || approvalState === ApprovalState.PENDING) ? (
          <Button
            fullWidth
            loading={approvalState === ApprovalState.PENDING}
            color="gradient"
            onClick={approve}
            disabled={approvalState !== ApprovalState.NOT_APPROVED}
          >
            {i18n._(t`Approve`)}
          </Button>
        ) : (
          <Button
            fullWidth
            color={!isDepositValid && !!parsedDepositValue ? 'red' : 'blue'}
            onClick={async () => {
              try {
                // KMP decimals depend on asset, SLP is always 18
                // @ts-ignore TYPE NEEDS FIXING
                const tx = await deposit(farm.id, BigNumber.from(parsedDepositValue?.quotient.toString()))
                if (tx?.hash) {
                  setContent(
                    <HeadlessUiModal.SubmittedModalContent
                      txHash={tx?.hash}
                      header={i18n._(t`Success!`)}
                      subheader={i18n._(t`Success! Transaction successfully submitted`)}
                      onDismiss={() => dispatch(setOnsenModalOpen(false))}
                    />
                  )
                  addTransaction(tx, {
                    summary: `Deposit ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                  })
                }
              } catch (error) {
                console.error(error)
              }
            }}
            disabled={!isDepositValid}
          >
            {depositError || i18n._(t`Confirm Deposit`)}
          </Button>
        )
      ) : !account ? (
        <Web3Connect color="blue" className="w-full" />
      ) : (
        <Button
          fullWidth
          color={!isWithdrawValid && !!parsedWithdrawValue ? 'red' : 'blue'}
          onClick={async () => {
            try {
              // KMP decimals depend on asset, SLP is always 18
              // @ts-ignore TYPE NEEDS FIXING
              const tx = await withdraw(farm.id, BigNumber.from(parsedWithdrawValue?.quotient.toString()))
              if (tx?.hash) {
                setContent(
                  <HeadlessUiModal.SubmittedModalContent
                    txHash={tx?.hash}
                    header={i18n._(t`Success!`)}
                    subheader={i18n._(t`Success! Transaction successfully submitted`)}
                    onDismiss={() => dispatch(setOnsenModalOpen(false))}
                  />
                )
                addTransaction(tx, {
                  summary: `Withdraw ${farm.pair.token0.name}/${farm.pair.token1.name}`,
                })
              }
            } catch (error) {
              console.error(error)
            }
          }}
          disabled={!isWithdrawValid}
        >
          {withdrawError || i18n._(t`Confirm Withdraw`)}
        </Button>
      )}
    </>
  )
}

export default ManageBar
