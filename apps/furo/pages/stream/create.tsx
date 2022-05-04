import { Select, Typography } from '@sushiswap/ui'
import { Amount, Token } from '@sushiswap/currency'
import Button from '@sushiswap/ui/button/Button'
import Dots from '@sushiswap/ui/dots/Dots'
import { useAllTokens, useFuroStreamContract } from 'hooks'
import { useCallback, useState } from 'react'
import { useAccount, useNetwork, useSendTransaction } from 'wagmi'
import { approveBentoBoxAction, batchAction, streamCreationAction } from 'features/actions'
import { createToast } from 'components/Toast'
import Layout from 'components/Layout'
import { Combobox } from '@sushiswap/ui'

const Create = () => {
  const tokens = useAllTokens()
  const contract = useFuroStreamContract()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<Token>()
  const [amount, setAmount] = useState<Amount<Token>>()
  const [fromBentoBox, setFromBentoBox] = useState<boolean>(true)
  const [recipient, setRecipient] = useState<string>()
  const [duration, setDuration] = useState<number>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { data: account } = useAccount()
  const { activeChain } = useNetwork()
  const { sendTransactionAsync, isLoading: isWritePending } = useSendTransaction()

  // const [bentoBoxApprovalState, signature, approveBentoBox] = useBentoBoxApproveCallback(open, contract?.address)
  // const [tokenApprovalState, approveToken] = useApproveCallback(
  //   open,
  //   amount,
  //   activeChain ? BENTOBOX_ADDRESS[activeChain?.id] : undefined,
  // )

  const createStream = useCallback(async () => {
    if (!token || !amount || !recipient || !startDate || !endDate || !contract || !account?.address) {
      console.log('missing required field', { token, amount, recipient, startDate, endDate })
      return
    }

    const actions = [
      approveBentoBoxAction({ contract, user: account.address, signature }),
      streamCreationAction({ contract, recipient, token, startDate, endDate, amount, fromBentoBox }),
    ]

    const data = await sendTransactionAsync({
      request: {
        from: account?.address,
        to: contract?.address,
        data: batchAction({ contract, actions }),
      },
    })

    createToast({
      title: 'Cancel stream',
      description: `You have successfully cancelled your stream`,
      promise: data.wait(),
    })
  }, [
    account?.address,
    amount,
    contract,
    endDate,
    fromBentoBox,
    recipient,
    sendTransactionAsync,
    // signature,
    startDate,
    token,
  ])

  return (
    <Layout maxWidth="3xl">
      <div className="md:grid md:grid-cols-[0px_360px] gap-6 mt-6 md:mt-24 bg-dark-900 p-5 rounded-xl shadow-md shadow-dark-1000">
        <div className="h-[72px] flex justify-center items-end -ml-[120px]">
          <div className="h-[44px] flex items-center">
            <div className="rounded-full border-2 border-high-emphesis w-6 h-6" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-grow">
            <Combobox
              className="w-full"
              onChange={setToken}
              label={<Combobox.Label>Token</Combobox.Label>}
              input={<Combobox.Input onChange={() => {}}>{token?.symbol}</Combobox.Input>}
            >
              <Combobox.Options>
                {Object.values(tokens).map((token) => (
                  <Combobox.Option key={token.address} value={token}>
                    {token.symbol}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </Combobox>
          </div>
          <Select
            onChange={setFromBentoBox}
            button={<Select.Button>{fromBentoBox ? 'Wallet' : 'BentoBox'}</Select.Button>}
            label={<Select.Label>From</Select.Label>}
          >
            <Select.Options>
              <Select.Option value={false}>Wallet</Select.Option>
              <Select.Option value={true}>BentoBox</Select.Option>
            </Select.Options>
          </Select>
        </div>
        <div className="h-[72px] flex justify-center items-end">
          <div className="h-[44px] flex items-center">
            <div className="rounded-full border-2 border-high-emphesis w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="sm" weight={500} className="text-high-emphesis">
            Amount to stream
          </Typography>
          <input
            type="number"
            placeholder="0.00"
            className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
            onChange={(e) => setAmount(Amount.fromRawAmount(token, parseInt(e.target.value)))}
          />
        </div>
        <div />
        <div className="h-px bg-dark-800 my-2" />
        <div className="h-[72px] flex justify-center items-end">
          <div className="h-[44px] flex items-center">
            <div className="rounded-full border-2 border-high-emphesis w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="sm" weight={500} className="text-high-emphesis">
            Recipient (ENS name or Address)
          </Typography>
          <input
            type="text"
            className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
            defaultValue={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div className="h-[72px] flex justify-center items-end">
          <div className="h-[44px] flex items-center">
            <div className="rounded-full border-2 border-high-emphesis w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="sm" weight={500} className="text-high-emphesis">
            Stream duration
          </Typography>
          <input
            type="text"
            placeholder="30 days"
            className="rounded-xl bg-dark-800 py-3 pl-4 pr-10 text-left shadow-md border-none text-sm font-bold"
            defaultValue={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div />
        <Button variant="filled" color="gradient" fullWidth disabled={isWritePending} onClick={createStream}>
          {isWritePending ? <Dots>Confirm Cancel</Dots> : 'Create stream'}
        </Button>
      </div>
    </Layout>
  )
}

export default Create
