import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import furoExports from '@sushiswap/furo/exports.json'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Button, classNames, createToast, Dialog, Dots, Typography } from '@sushiswap/ui'
import { getFuroVestingContractConfig, useFuroVestingContract } from '@sushiswap/wagmi'
import { CurrencyInput } from 'components'
import { useVestingBalance, Vesting } from 'lib'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  vesting?: Vesting
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ vesting }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const [input, setInput] = useState<string>('')
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const balance = useVestingBalance(activeChain?.id, vesting?.id, vesting?.token)
  const contract = useFuroVestingContract(activeChain?.id)

  const amount = useMemo(() => {
    if (!vesting?.token) return undefined
    return tryParseAmount(input, vesting.token)
  }, [input, vesting?.token])

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    getFuroVestingContractConfig(activeChain?.id),
    'withdraw',
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const withdraw = useCallback(async () => {
    if (!vesting || !amount || !activeChain?.id) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [BigNumber.from(vesting.id), '0x', fundSource === FundSource.BENTOBOX],
      })

      createToast({
        txHash: data.hash,
        href: Chain.from(activeChain.id).getTxUrl(data.hash),
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Withdrawing {amount.toSignificant(6)} {amount.currency.symbol}
            </Dots>
          ),
          completed: `Successfully withdrawn ${amount.toSignificant(6)} ${amount.currency.symbol}`,
          failed: 'Something went wrong withdrawing from vesting schedule',
        },
      })
    } catch (e: any) {
      setError(e.message)

      log.tenderly({
        chainId: activeChain?.id,
        from: account?.address,
        to:
          furoExports[activeChain?.id as unknown as keyof typeof furoExports]?.[0]?.contracts?.FuroVesting?.address ??
          AddressZero,
        data: contract?.interface.encodeFunctionData('withdraw', [
          BigNumber.from(vesting.id),
          '0x',
          fundSource === FundSource.BENTOBOX,
        ]),
      })
    }
  }, [account?.address, activeChain?.id, amount, contract?.interface, fundSource, vesting, writeAsync])

  return (
    <>
      <Button
        fullWidth
        variant="filled"
        color="gradient"
        disabled={!account || !vesting?.canWithdraw(account.address)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-6 !max-w-sm">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <div className="flex flex-col gap-2">
            <CurrencyInput.Base
              currency={vesting?.token}
              onChange={setInput}
              value={input}
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
          </div>
          <div className="grid items-center grid-cols-2 gap-5">
            <div
              onClick={() => setFundSource(FundSource.WALLET)}
              className={classNames(
                fundSource === FundSource.WALLET
                  ? 'border-green/70 ring-green/70'
                  : 'ring-transparent border-slate-700',
                'ring-1 bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                Wallet
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your Wallet
              </Typography>
              {fundSource === FundSource.WALLET && (
                <div className="absolute w-5 h-5 top-3 right-3">
                  <CheckCircleIcon className="text-green/70" />
                </div>
              )}
            </div>
            <div
              onClick={() => setFundSource(FundSource.BENTOBOX)}
              className={classNames(
                fundSource === FundSource.BENTOBOX
                  ? 'border-green/70 ring-green/70'
                  : 'ring-transparent border-slate-700',
                'ring-1 bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={700} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                Bentobox
              </Typography>
              <Typography variant="xs" className="text-slate-400">
                Receive funds in your BentoBox
              </Typography>
              {fundSource === FundSource.BENTOBOX && (
                <div className="absolute w-5 h-5 top-3 right-3">
                  <CheckCircleIcon className="text-green/70" />
                </div>
              )}
            </div>
          </div>
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
