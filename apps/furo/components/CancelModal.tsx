import { ContractInterface } from '@ethersproject/contracts'
import { TrashIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { Button, classNames, createToast, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Stream, Vesting } from 'lib'
import { FC, useCallback, useState } from 'react'
import { useAccount, useDeprecatedContractWrite, useNetwork } from 'wagmi'

interface CancelModalProps {
  title: string
  stream?: Stream | Vesting
  abi: ContractInterface
  address: string
  fn: string
}

export const CancelModal: FC<CancelModalProps> = ({ stream, abi, address: contractAddress, fn, title }) => {
  const [open, setOpen] = useState(false)
  const { chain: activeChain } = useNetwork()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { address } = useAccount()

  const { writeAsync, isLoading: isWritePending } = useDeprecatedContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: fn,
    onSuccess() {
      setOpen(false)
    },
  })

  const cancelStream = useCallback(async () => {
    if (!stream || !address || !activeChain?.id) return
    const data = await writeAsync({ args: [stream.id, fundSource === FundSource.BENTOBOX] })
    const ts = new Date().getTime()
    createToast({
      type: 'cancelStream',
      txHash: data.hash,
      chainId: activeChain.id,
      timestamp: ts,
      groupTimestamp: ts,
      promise: data.wait(),
      summary: {
        pending: <Dots>Cancelling stream</Dots>,
        completed: `Successfully cancelled stream`,
        failed: 'Something went wrong cancelling the stream',
      },
    })
  }, [address, activeChain?.id, fundSource, stream, writeAsync])

  if (!address || !stream?.canCancel(address)) return <></>

  return (
    <>
      <Button
        fullWidth
        color="gray"
        startIcon={<TrashIcon className="text-red-400" width={18} height={18} />}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-3 !max-w-xs">
          <Dialog.Header title={title} onClose={() => setOpen(false)} />
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
                fundSource === FundSource.BENTOBOX
                  ? 'border-green/70 ring-green/70'
                  : 'ring-transparent border-slate-700',
                'ring-1 bg-slate-800 rounded-2xl px-5 py-3 cursor-pointer relative flex flex-col justify-center gap-3 min-w-[140px]'
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
          <Typography variant="xs" weight={400} className="italic text-center text-slate-400">
            This will send the remaining amount of <br />{' '}
            <span className="font-medium text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
            </span>{' '}
            to your{' '}
            <span className="font-medium text-slate-200">
              {fundSource === FundSource.BENTOBOX ? 'BentoBox' : 'Wallet'}
            </span>
          </Typography>
          <Dialog.Actions>
            <Button
              variant="filled"
              color="gradient"
              fullWidth
              disabled={isWritePending || stream?.isEnded}
              onClick={cancelStream}
            >
              {isWritePending ? <Dots>Confirm Cancel</Dots> : title}
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
