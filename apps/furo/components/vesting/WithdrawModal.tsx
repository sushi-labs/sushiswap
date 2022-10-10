import { BigNumber } from '@ethersproject/bignumber'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import log from '@sushiswap/log'
import { Button, classNames, createToast, DEFAULT_INPUT_BG, Dialog, Dots, Typography } from '@sushiswap/ui'
import { getFuroVestingContractConfig, useFuroVestingContract } from '@sushiswap/wagmi'
import { useVestingBalance, Vesting } from 'lib'
import { FC, useCallback, useState } from 'react'
import { useAccount, useDeprecatedContractWrite, useNetwork } from 'wagmi'

interface WithdrawModalProps {
  vesting?: Vesting
}

export const WithdrawModal: FC<WithdrawModalProps> = ({ vesting }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string>()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { chain: activeChain } = useNetwork()
  const { address } = useAccount()
  const balance = useVestingBalance(activeChain?.id, vesting?.id, vesting?.token)
  const contract = useFuroVestingContract(activeChain?.id)

  const { writeAsync, isLoading: isWritePending } = useDeprecatedContractWrite({
    ...getFuroVestingContractConfig(activeChain?.id),
    functionName: 'withdraw',
    onSuccess() {
      setOpen(false)
    },
  })

  const withdraw = useCallback(async () => {
    if (!vesting || !balance || !activeChain?.id) return

    setError(undefined)

    try {
      const data = await writeAsync({
        args: [BigNumber.from(vesting.id), '0x', fundSource === FundSource.BENTOBOX],
      })
      const ts = new Date().getTime()
      createToast({
        type: 'withdrawVesting',
        txHash: data.hash,
        chainId: activeChain.id,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: (
            <Dots>
              Withdrawing {balance.toSignificant(6)} {balance.currency.symbol}
            </Dots>
          ),
          completed: `Successfully withdrawn ${balance.toSignificant(6)} ${balance.currency.symbol}`,
          failed: 'Something went wrong withdrawing from vesting schedule',
        },
      })
    } catch (e: any) {
      setError(e.message)

      log.tenderly({
        chainId: activeChain?.id,
        from: address,
        to: getFuroVestingContractConfig(activeChain?.id)?.addressOrName,
        data: contract?.interface.encodeFunctionData('withdraw', [
          BigNumber.from(vesting.id),
          '0x',
          fundSource === FundSource.BENTOBOX,
        ]),
      })
    }
  }, [vesting, balance, activeChain.id, writeAsync, fundSource, address, contract?.interface])

  return (
    <>
      <Button
        fullWidth
        variant="filled"
        color="gradient"
        disabled={!address || !vesting?.canWithdraw(address)}
        onClick={() => {
          setOpen(true)
        }}
      >
        Withdraw
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-3 !max-w-xs">
          <Dialog.Header title="Withdraw" onClose={() => setOpen(false)} />
          <div className="grid items-center grid-cols-2 gap-3">
            <div
              onClick={() => setFundSource(FundSource.WALLET)}
              className={classNames(
                fundSource === FundSource.WALLET ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
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
                fundSource === FundSource.BENTOBOX ? 'ring-green/70' : 'ring-transparent',
                DEFAULT_INPUT_BG,
                'ring-2 ring-offset-2 ring-offset-slate-800 rounded-xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
              )}
            >
              <Typography weight={500} variant="sm" className="!leading-5 tracking-widest text-slate-200">
                BentoBox
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
          <Typography variant="xs" weight={400} className="text-slate-300 py-2 text-center">
            There are currently{' '}
            <span className="font-semibold">
              {balance?.toSignificant(6)} {balance.currency.symbol}
            </span>{' '}
            unlocked tokens available for withdrawal.
          </Typography>
          {error && (
            <Typography variant="xs" className="text-center text-red" weight={500}>
              {error}
            </Typography>
          )}
          <Dialog.Actions>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={isWritePending || !balance || !balance.greaterThan(0)}
              onClick={withdraw}
            >
              {!vesting?.token ? 'Invalid stream token' : isWritePending ? <Dots>Confirm Withdraw</Dots> : 'Withdraw'}
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
