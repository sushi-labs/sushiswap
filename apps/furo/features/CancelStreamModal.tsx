import { TrashIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Button, classNames, Dialog, Dots, Form, Typography } from '@sushiswap/ui'
import { createToast } from 'components'
import { Stream } from 'features/context/Stream'
import { FundSource, useFundSourceToggler } from 'hooks/useFundSourceToggler'
import { FC, useCallback, useState } from 'react'
import { useAccount, useContractWrite } from 'wagmi'

interface CancelStreamModalProps {
  stream?: Stream
  abi: object
  address: string
  fn: string
}

const CancelStreamModal: FC<CancelStreamModalProps> = ({ stream, abi, address, fn }) => {
  const [open, setOpen] = useState(false)
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.BENTOBOX)
  const { data: account } = useAccount()

  const { writeAsync, isLoading: isWritePending } = useContractWrite(
    {
      addressOrName: address,
      contractInterface: abi,
    },
    fn,
    {
      onSuccess() {
        setOpen(false)
      },
    }
  )

  const cancelStream = useCallback(async () => {
    if (!stream || !account) return
    const data = await writeAsync({ args: [stream.id, fundSource === FundSource.BENTOBOX] })

    createToast({
      title: 'Cancel stream',
      description: `You have successfully cancelled your stream`,
      promise: data.wait(),
    })
  }, [account, fundSource, stream, writeAsync])

  if (account?.address && !stream?.canCancel(account.address)) return <></>

  return (
    <>
      <Button
        variant="filled"
        color="red"
        startIcon={<TrashIcon className="text-red-900" width={24} height={24} />}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-sm">
          <Dialog.Header title="Cancel Stream" onClose={() => setOpen(false)} />
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
          <Typography variant="xs" weight={400} className="text-center italic text-slate-400">
            This will send the remaining amount of <br />{' '}
            <span className="font-bold text-slate-200">
              {stream?.remainingAmount?.toSignificant(6)} {stream?.remainingAmount.currency.symbol}
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
            {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Cancel Stream'}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default CancelStreamModal
