import { AddressZero } from '@ethersproject/constants'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Button, classNames, Dialog, Dots, Form, Typography } from '@sushiswap/ui'
import FUROVESTING_ABI from 'abis/FuroVesting.json'
import { createToast, CurrencyInput } from 'components'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { Vesting } from 'features'
import { logTenderlyUrl } from 'functions/getTenderly'
import { useFuroVestingContract, useVestingBalance, VESTING_ADDRESS } from 'hooks'
import { FundSource, useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  vesting?: Vesting
}

const WithdrawModal: FC<WithdrawModalProps> = ({ vesting }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.BENTOBOX)
  const balance = useVestingBalance(vesting?.id, vesting?.token)
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const contract = useFuroVestingContract()

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: activeChain?.id ? VESTING_ADDRESS[activeChain.id] : AddressZero,
      contractInterface: FUROVESTING_ABI,
    },
    'withdraw',
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const withdraw = useCallback(async () => {
    if (!vesting || !amount) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [BigNumber.from(vesting.id), '0x', fundSource === FundSource.BENTOBOX],
      })

      createToast({
        title: 'Withdraw from stream',
        description: `You have successfully withdrawn ${amount.toSignificant(6)} ${
          amount.currency.symbol
        } from your stream`,
        promise: data.wait(),
      })

      console.log('hi')
      // Optimistic response
      data.wait().then(() => {
        if (vesting && amount) {
          vesting.withdrawnAmount = vesting.withdrawnAmount.add(amount)
          vesting.balance = vesting.balance.subtract(amount)
        }
      })
    } catch (e: any) {
      setError(e.message)

      logTenderlyUrl({
        chainId: activeChain?.id,
        from: account.address,
        to: activeChain?.id ? VESTING_ADDRESS[activeChain.id] : AddressZero,
        data: contract?.interface.encodeFunctionData('withdraw', [
          BigNumber.from(vesting.id),
          '0x',
          fundSource === FundSource.BENTOBOX,
        ]),
      })
    }
  }, [account.address, activeChain.id, amount, contract?.interface, fundSource, vesting, writeAsync])

  const onInput = useCallback(
    (val: string) => {
      if (isNaN(Number(val)) || Number(val) <= 0 || !vesting?.token) {
        setAmount(undefined)
      } else {
        setAmount(Amount.fromRawAmount(vesting.token, JSBI.BigInt(parseUnits(val, vesting.token.decimals).toString())))
      }
    },
    [vesting?.token]
  )

  return (
    <>
      <Button
        variant="filled"
        color="gradient"
        disabled={account?.address && !vesting?.canWithdraw(account.address)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-6 !max-w-sm">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <Form.Control label="Amount to withdraw">
            <CurrencyInput.Base
              token={vesting?.token}
              onChange={onInput}
              value={amount?.toExact()}
              error={amount && balance && amount.greaterThan(balance)}
              bottomPanel={<CurrencyInput.BottomPanel loading={false} label="Available" amount={balance} />}
              helperTextPanel={
                amount && balance && amount.greaterThan(balance) ? (
                  <CurrencyInput.HelperTextPanel isError={true} text="Not enough available" />
                ) : (
                  <></>
                )
              }
            />
          </Form.Control>
          <Form.Control label="Receive funds in">
            <div className="grid grid-cols-2 gap-5 items-center">
              <div
                onClick={() => setFundSource(FundSource.BENTOBOX)}
                className={classNames(
                  fundSource === FundSource.BENTOBOX
                    ? 'border-green/70 ring-green/70'
                    : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                )}
              >
                <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                  Bentobox
                </Typography>
                {fundSource === FundSource.BENTOBOX && (
                  <div className="absolute top-3 right-3 w-5 h-5">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
              <div
                onClick={() => setFundSource(FundSource.WALLET)}
                className={classNames(
                  fundSource === FundSource.WALLET
                    ? 'border-green/70 ring-green/70'
                    : 'ring-transparent border-slate-700',
                  'ring-1 border bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
                )}
              >
                <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-300">
                  Wallet
                </Typography>
                {fundSource === FundSource.WALLET && (
                  <div className="absolute top-3 right-3 w-5 h-5">
                    <CheckCircleIcon className="text-green/70" />
                  </div>
                )}
              </div>
            </div>
          </Form.Control>
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || !amount || !balance || !amount.greaterThan(0) || amount.greaterThan(balance)}
            onClick={withdraw}
          >
            {!amount?.greaterThan(0) ? (
              'Enter an amount'
            ) : !vesting?.token ? (
              'Invalid stream token'
            ) : isWritePending ? (
              <Dots>Confirm Withdraw</Dots>
            ) : (
              'Withdraw'
            )}
          </Button>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={700}>
              {error}
            </Typography>
          )}
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default WithdrawModal
