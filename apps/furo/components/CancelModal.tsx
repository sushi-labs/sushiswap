import { TransactionRequest } from '@ethersproject/providers'
import { TrashIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { FundSource, useFundSourceToggler } from '@sushiswap/hooks'
import { Button, classNames, DEFAULT_INPUT_BG, Dialog, Dots, Typography } from '@sushiswap/ui'
import { useSendTransaction } from '@sushiswap/wagmi/hooks/useSendTransaction'
import { Checker } from '@sushiswap/wagmi/systems'
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import { useAccount, useContract } from '@sushiswap/wagmi'
import { SendTransactionResult } from '@sushiswap/wagmi/actions'

import { Stream, Vesting } from '../lib'
import { createToast } from '@sushiswap/ui/future/components/toast'

interface CancelModalProps {
  title: string
  stream?: Stream | Vesting
  abi: NonNullable<Parameters<typeof useContract>['0']>['abi']
  address: string
  fn: string
  chainId: ChainId
}

export const CancelModal: FC<CancelModalProps> = ({ stream, abi, address: contractAddress, fn, title, chainId }) => {
  const [open, setOpen] = useState(false)
  const { value: fundSource, setValue: setFundSource } = useFundSourceToggler(FundSource.WALLET)
  const { address } = useAccount()

  const contract = useContract({
    address: contractAddress,
    abi: abi,
  })

  const prepare = useCallback(
    (setRequest: Dispatch<SetStateAction<(TransactionRequest & { to: string }) | undefined>>) => {
      if (!stream || !address) return

      setRequest({
        from: address,
        to: contractAddress,
        data: contract?.interface.encodeFunctionData(fn, [stream.id, fundSource === FundSource.BENTOBOX]),
      })
    },
    [stream, address, contractAddress, contract?.interface, fn, fundSource]
  )

  const onSettled = useCallback(
    async (data: SendTransactionResult | undefined) => {
      if (!data) return

      const ts = new Date().getTime()
      createToast({
        account: address,
        type: 'cancelStream',
        txHash: data.hash,
        chainId,
        timestamp: ts,
        groupTimestamp: ts,
        promise: data.wait(),
        summary: {
          pending: `Cancelling stream`,
          completed: `Successfully cancelled stream`,
          failed: 'Something went wrong cancelling the stream',
        },
      })
    },
    [chainId, address]
  )

  const { sendTransaction, isLoading: isWritePending } = useSendTransaction({
    chainId,
    prepare,
    onSettled,
    onSuccess() {
      setOpen(false)
    },
    enabled: Boolean(stream && address),
  })

  if (!address || !stream?.canCancel(address)) return <></>

  return (
    <>
      <Checker.Connected>
        <Checker.Network chainId={chainId}>
          <Button
            fullWidth
            color="gray"
            startIcon={<TrashIcon className="text-red-400" width={18} height={18} />}
            onClick={() => setOpen(true)}
          />
        </Checker.Network>
      </Checker.Connected>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-4 !max-w-xs !pb-4">
          <Dialog.Header title={title} onClose={() => setOpen(false)} />
          <div className="grid items-center grid-cols-2 gap-5">
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
          <Button
            size="md"
            variant="filled"
            fullWidth
            disabled={isWritePending || stream?.isEnded}
            onClick={() => sendTransaction?.()}
          >
            {isWritePending ? <Dots>Confirm Cancel</Dots> : title}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
