import { tryParseAmount } from '@sushiswap/currency'
import { formatUSD } from '@sushiswap/format'
import { abi } from '@sushiswap/kashi/artifacts/contracts/KashiPair.sol/KashiPair.json'
import { KashiPairMediumRiskV1 } from '@sushiswap/kashi/typechain'
import { Button, Dialog, Typography } from '@sushiswap/ui'
import { Icon } from '@sushiswap/ui/currency/Icon'
import { Widget } from '@sushiswap/ui/widget'
import { Approve, BENTOBOX_ADDRESS, useBentoBoxContract, usePrices, Web3Input } from '@sushiswap/wagmi'
import { KASHI_ADDRESS } from 'config'
import { BigNumber, Signature } from 'ethers'
import KashiCooker from 'lib/KashiCooker'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC, useCallback, useMemo, useState } from 'react'
import { useAccount, useContract, useSigner } from 'wagmi'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { useCustomTokens, useNotifications } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'
interface LendWidget {
  pair: KashiMediumRiskLendingPairV1
}

export const LendWidget: FC<LendWidget> = ({ pair }) => {
  const { address: account } = useAccount()
  const [signature, setSignature] = useState<Signature>()
  const bentoBoxContract = useBentoBoxContract(pair.chainId)
  const { data: signerOrProvider } = useSigner()
  const kashiMediumRiskV1Contract = useContract<KashiPairMediumRiskV1>({
    addressOrName: pair.address,
    contractInterface: abi,
    signerOrProvider,
  })
  const { asset } = useTokensFromKashiPair(pair)
  const [value, setValue] = useState('')
  const amount = useMemo(() => tryParseAmount(value, asset), [asset, value])
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(pair.chainId)
  const tokenMap = useTokens(pair.chainId)
  const [review, setReview] = useState(false)
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const [, { createNotification }] = useNotifications(account)

  const execute = useCallback(async () => {
    console.log('exec', !pair || !account || !kashiMediumRiskV1Contract || !amount)
    if (!pair || !account || !kashiMediumRiskV1Contract || !amount) return

    const cooker = new KashiCooker({ chainId: pair.chainId, pair, account, contract: kashiMediumRiskV1Contract })

    if (signature) cooker.setMasterContractApproval(signature)

    cooker.updateExchangeRate(false)

    const deadBalance = await bentoBoxContract.balanceOf(
      pair.asset.address,
      '0x000000000000000000000000000000000000dead'
    )

    cooker.addAsset(amount)

    if (deadBalance.isZero()) {
      cooker.removeAsset(BigNumber.from(1000), true)
      cooker.bentoBoxTransferAsset('0x000000000000000000000000000000000000dead', BigNumber.from(1000))
    }

    await cooker.cook()
  }, [account, amount, bentoBoxContract, kashiMediumRiskV1Contract, pair, signature])
  return (
    <>
      <Widget id="depositCollateral" maxWidth="md">
        <Widget.Content>
          <Widget.Header title="Deposit" />
          <Web3Input.Currency
            className="p-3"
            loading={false}
            value={value}
            onChange={setValue}
            currency={asset}
            customTokenMap={customTokensMap}
            onAddToken={addCustomToken}
            onRemoveToken={removeCustomToken}
            chainId={pair.chainId}
            tokenMap={tokenMap}
          />
          <div className="p-3">
            <Button fullWidth disabled={!value} onClick={() => setReview(true)}>
              {!value ? 'Enter Amount' : 'Review'}
            </Button>
          </div>
        </Widget.Content>
      </Widget>
      <Dialog open={review} onClose={() => setReview(false)}>
        <Dialog.Content className="max-w-sm !pb-4">
          <Dialog.Header border={false} title="Confirm Deposit" onClose={() => setReview(false)} />
          <div className="!my-0 grid grid-cols-12 items-center">
            <div className="relative flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-between w-full gap-2">
                  <Typography variant="h3" weight={500} className="truncate text-slate-50">
                    {amount?.toSignificant(6)}{' '}
                  </Typography>
                  <div className="flex items-center justify-end gap-2 text-right">
                    {amount && (
                      <div className="w-5 h-5">
                        <Icon currency={amount.currency} width={20} height={20} />
                      </div>
                    )}
                    <Typography variant="h3" weight={500} className="text-right text-slate-50">
                      {amount?.currency.symbol}
                    </Typography>
                  </div>
                </div>
              </div>
              <Typography variant="sm" weight={500} className="text-slate-500">
                {amount && prices?.[asset.wrapped.address]
                  ? formatUSD(amount?.multiply(prices?.[asset.wrapped.address].asFraction).toFixed(2))
                  : '-'}
              </Typography>
            </div>
            {/*<div className="flex items-center justify-center col-span-12 -mt-2.5 -mb-2.5">*/}
            {/*  <div className="p-0.5 bg-slate-700 border-2 border-slate-800 ring-1 ring-slate-200/5 z-10 rounded-full">*/}
            {/*    <PlusIcon width={18} height={18} className="text-slate-200" />*/}
            {/*  </div>*/}
            {/*</div>*/}
            {/*<div className="flex flex-col col-span-12 gap-1 p-2 border sm:p-4 rounded-2xl bg-slate-700/40 border-slate-200/5">*/}
            {/*  <div className="flex items-center gap-2">*/}
            {/*    <div className="flex items-center justify-between w-full gap-2">*/}
            {/*      <Typography variant="h3" weight={500} className="truncate text-slate-50">*/}
            {/*        {parsedInput1?.toSignificant(6)}{' '}*/}
            {/*      </Typography>*/}
            {/*      <div className="flex items-center justify-end gap-2 text-right">*/}
            {/*        {parsedInput1 && (*/}
            {/*          <div className="w-5 h-5">*/}
            {/*            <Icon currency={parsedInput1.currency} width={20} height={20} />*/}
            {/*          </div>*/}
            {/*        )}*/}
            {/*        <Typography variant="h3" weight={500} className="text-right text-slate-50">*/}
            {/*          {parsedInput1?.currency.symbol}*/}
            {/*        </Typography>*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <Approve
            onSuccess={createNotification}
            className="flex-grow !justify-end mt-3"
            components={
              <Approve.Components>
                <Approve.Token
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  amount={amount}
                  address={BENTOBOX_ADDRESS[pair.chainId]}
                  enabled={Boolean(BENTOBOX_ADDRESS[pair.chainId])}
                />
                <Approve.Bentobox
                  size="md"
                  className="whitespace-nowrap"
                  fullWidth
                  address={KASHI_ADDRESS[pair.chainId]}
                  onSignature={setSignature}
                  enabled={Boolean(KASHI_ADDRESS[pair.chainId])}
                />
              </Approve.Components>
            }
            render={({ approved }) => {
              console.log({ approved })
              return (
                <Button size="md" disabled={!approved} fullWidth color="gradient" onClick={execute}>
                  Confirm Deposit
                </Button>
              )
            }}
          />
        </Dialog.Content>
      </Dialog>
    </>
  )
}
