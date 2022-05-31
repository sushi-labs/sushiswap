import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { CHAIN_KEY, CurrencyAmount, Token } from '@sushiswap/core-sdk'
import MISO from '@sushiswap/miso/exports/all.json'
import Button from 'app/components/Button'
import Dots from 'app/components/Dots'
import Form from 'app/components/Form'
import FormFieldHelperText from 'app/components/Form/FormFieldHelperText'
import Typography from 'app/components/Typography'
import { AuctionCreationFormInput } from 'app/features/miso/AuctionCreationForm'
import { tryParseAmount } from 'app/functions'
import { ApprovalState, useApproveCallback } from 'app/hooks'
import { useToken } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

interface AuctionCreationFormTokenProps {}

const AuctionCreationFormTokenAmount: FC<AuctionCreationFormTokenProps> = ({}) => {
  const { chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const {
    watch,
    formState: { errors },
  } = useFormContext<AuctionCreationFormInput>()
  const data = watch()
  const auctionToken = useToken(data.token)

  let amount: CurrencyAmount<Token> | undefined
  if (auctionToken && Number(data.tokenAmount) > 0) {
    amount = tryParseAmount(data.tokenAmount?.toString(), auctionToken)
  }

  const [approvalState, approve] = useApproveCallback(
    amount,
    // @ts-ignore TYPE NEEDS FIXING
    chainId ? MISO[chainId]?.[CHAIN_KEY[chainId]]?.contracts.MISOMarket.address : undefined
  )

  const approveButton =
    approvalState === ApprovalState.NOT_APPROVED ? (
      <Button color="blue" onClick={approve} className="h-[42px]">
        {i18n._(t`Approve`)}
      </Button>
    ) : approvalState === ApprovalState.PENDING ? (
      <Button color="blue" disabled={true} className="h-[42px]">
        <Dots>{i18n._(t`Approving`)}</Dots>
      </Button>
    ) : (
      <></>
    )

  return (
    <div className="col-span-4 lg:col-span-2">
      <div className="flex gap-x-4">
        <div className="flex flex-col flex-grow">
          <Form.TextField
            {...(auctionToken && {
              endIcon: (
                <Typography variant="sm" weight={700} className="text-secondary">
                  {auctionToken.symbol}
                </Typography>
              ),
            })}
            error={
              auctionToken === undefined && !errors['token'] && data.token && data.token.length > 0
                ? i18n._(t`Token does not exist`)
                : approvalState === ApprovalState.NOT_APPROVED
                ? i18n._(t`Not enough allowance, please approve to increase your allowance`)
                : undefined
            }
            name="tokenAmount"
            label={i18n._(t`Token Amount*`)}
            helperText={
              approvalState === ApprovalState.APPROVED ? (
                <FormFieldHelperText className="!text-green">{i18n._(t`Token approved!`)}</FormFieldHelperText>
              ) : (
                i18n._(t`Token amount must be lower than or equal to allowance. `)
              )
            }
            placeholder={i18n._(t`Enter the amount of tokens you would like to auction.`)}
          />
        </div>
        <div className="flex justify-end mt-7">
          <div>{approveButton}</div>
        </div>
      </div>
    </div>
  )
}

export default AuctionCreationFormTokenAmount
