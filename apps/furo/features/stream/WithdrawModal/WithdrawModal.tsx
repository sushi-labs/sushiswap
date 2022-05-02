import { Stream } from 'features/context/Stream'
import { useToken } from 'hooks/Tokens'
import { useFuroStreamContract, useStreamBalance } from 'hooks/useFuroStreamContract'
import { Amount, Token } from '@sushiswap/currency'
import { BigNumber } from 'ethers'
import { JSBI } from '@sushiswap/math'
import { FC, useCallback, useRef, useState } from 'react'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui'
import Button from '@sushiswap/ui/button/Button'
import WithdrawProgressSVG from './WithdrawProgressSVG'
import { ZERO } from '@sushiswap/core-sdk'
import { parseUnits } from 'ethers/lib/utils'

interface WithdrawModalProps {
  stream?: Stream
}

const WithdrawModal: FC<WithdrawModalProps> = ({ stream }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<Amount<Token>>()
  const inputRef = useRef<HTMLInputElement>()
  const token = useToken(stream?.token.address)
  const contract = useFuroStreamContract()
  const balance = useStreamBalance(stream.id)
  const [attempt, setAttempt] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const withdraw = useCallback(async () => {
    if (!stream || !amount) return

    setAttempt(true)

    try {
      const tx = await contract.withdrawFromStream(
        BigNumber.from(stream.id),
        BigNumber.from(amount.quotient.toString()),
        stream.recipient.id,
        false,
        '0x',
      )

      if (tx?.hash) {
        await tx.wait()
      }
    } finally {
      setAttempt(false)
    }
  }, [amount, contract, stream])

  const onInput = useCallback(
    (e) => {
      if (isNaN(e.target.value) || +e.target.value <= 0) {
        setAmount(undefined)
      } else {
        setAmount(Amount.fromRawAmount(token, JSBI.BigInt(parseUnits(e.target.value, token.decimals).toString())))
      }
    },
    [token],
  )

  const buttonError = !amount?.greaterThan(ZERO)
    ? 'Enter an amount'
    : amount.greaterThan(Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0)))
    ? 'Not enough balance'
    : 'Withdraw'

  return (
    <>
      <Button
        variant="filled"
        color="gradient"
        // disabled={stream.recipient.id.toLowerCase() !== account?.address.toLowerCase()}
        onClick={openModal}
      >
        Withdraw
      </Button>
      <Dialog open={isOpen} onClose={closeModal}>
        <Dialog.Content className="space-y-4 max-w-sm">
          <Dialog.Header title="Withdraw" onClose={closeModal} />
          <div className="flex justify-between gap-1 pt-3">
            <div className="flex flex-col">
              <Typography variant="sm" weight={700}>
                {stream?.withdrawnAmount.toExact()} {stream?.token.symbol}
              </Typography>
              <Typography variant="xs" weight={500} className="text-secondary">
                Already withdrawn
              </Typography>
            </div>
            <div className="flex flex-col items-end">
              <Typography variant="sm" weight={700}>
                {stream?.amount.subtract(Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0))).toExact()}{' '}
                {stream?.token.symbol}
              </Typography>
              <Typography variant="xs" weight={500} className="text-secondary">
                Not yet streamed
              </Typography>
            </div>
          </div>
          <WithdrawProgressSVG stream={stream} />
          <div
            className="border border-blue/30 hover:border-blue/60 p-5 rounded-lg flex flex-col gap-3"
            onClick={() => inputRef.current.focus()}
          >
            <div className="flex justify-between gap-3">
              <Typography variant="sm" weight={400}>
                Available to Withdraw:
              </Typography>
              <Typography
                weight={700}
                className="text-high-emphesis"
                onClick={() => setAmount(Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0)))}
              >
                {balance ? Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0)).toSignificant(6) : ''}{' '}
                {stream?.token.symbol}
              </Typography>
            </div>
            <div className="flex">
              <input
                value={amount?.toExact()}
                ref={inputRef}
                onChange={onInput}
                type="text"
                inputMode="decimal"
                title="Token Amount"
                autoComplete="off"
                autoCorrect="off"
                placeholder="0.00"
                pattern="^[0-9]*[.,]?[0-9]*$"
                className="placeholder:text-secondary bg-transparent p-0 text-2xl !ring-0 !outline-none !border-none font-bold w-full"
              />
            </div>
          </div>
          <Button
            variant="filled"
            size="md"
            color="gradient"
            fullWidth
            loading={attempt}
            disabled={
              attempt ||
              !amount ||
              !amount?.greaterThan(ZERO) ||
              amount.greaterThan(Amount.fromRawAmount(stream?.token, JSBI.BigInt(balance ?? 0)))
            }
            onClick={withdraw}
          >
            {buttonError}
          </Button>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
export default WithdrawModal
