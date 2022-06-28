import { ContractInterface } from '@ethersproject/contracts'
import { TrashIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { Button, classNames, createToast, Dialog, Dots, Typography } from '@sushiswap/ui'
import { Stream } from 'lib'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface CancelModalProps {
  title: string
  stream?: Stream
  abi: ContractInterface
  address: string
  fn: string
}

export const CancelModal: FC<CancelModalProps> = ({ stream, abi, address: contractAddress, fn, title }) => {
  const [open, setOpen] = useState(false)
  const { chain: activeChain } = useNetwork()
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { address } = useAccount()

  const { writeAsync, isLoading: isWritePending } = useContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: fn,
    onSuccess() {
      setOpen(false)
    },
  })

  const cancelStream = useCallback(async () => {
    if (!stream || !account || !activeChain?.id) return
    const data = await writeAsync({ args: [stream.id, fundSource === FundSource.BENTOBOX] })

    createToast({
      txHash: data.hash,
      href: Chain.from(activeChain.id).getTxUrl(data.hash),
      promise: data.wait(),
      summary: {
        pending: <Dots>Cancelling stream</Dots>,
        completed: `Successfully cancelled stream`,
        failed: 'Something went wrong cancelling the stream',
      },
    })
  }, [account, activeChain?.id, fundSource, stream, writeAsync])

  if (!account || !stream?.canCancel(address)) return <></>

  return (
    <>
      <Button
        fullWidth
        color="gray"
        startIcon={<TrashIcon className="text-red-400" width={18} height={18} />}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-sm">
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
          <Typography variant="xs" weight={400} className="italic text-center text-slate-400">
            This will send the remaining amount of <br />{' '}
            <span className="font-bold text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount?.currency.symbol}
            </span>{' '}
            to your{' '}
            <span className="font-bold text-slate-200">
              {fundSource === FundSource.BENTOBOX ? 'Bentobox' : 'Wallet'}
            </span>
          </Typography>
          <Button
            variant="filled"
            color="gradient"
            fullWidth
            disabled={isWritePending || stream?.isEnded}
            onClick={cancelStream}
          >
            {isWritePending ? <Dots>Confirm Cancel</Dots> : title}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
