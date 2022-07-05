import { Signature } from '@ethersproject/bytes'
import { AddressZero } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import { yupResolver } from '@hookform/resolvers/yup'
import { Amount } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { Button, Dots, Form } from '@sushiswap/ui'
import { Approve } from '@sushiswap/wagmi'
import { createToast } from 'components'
import { IncentiveAmountDetails } from 'components/CreateForm/IncentiveAmountDetails'
import { createIncentiveSchema } from 'components/CreateForm/schema'
import { CreateIncentiveFormData, CreateIncentiveFormDataValidated } from 'components/CreateForm/types'
import { networks, useStakingContract } from 'lib/hooks'
import { FC, useCallback, useMemo, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

import STAKING_ABI from '../../abis/Staking.json'
import { GeneralDetailsSection } from './GeneralDetailsSection'

export const CreateForm: FC = () => {
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const [error, setError] = useState<string>()
  const contract = useStakingContract(activeChain?.id)
  const { isLoading: isWritePending, write: writeCreateIncentive } = useContractWrite({
    addressOrName: activeChain?.id ? networks.get(activeChain?.id) ?? AddressZero : AddressZero,
    contractInterface: STAKING_ABI ?? [],
    functionName: 'createIncentive',
  })

  const [signature, setSignature] = useState<Signature>()

  const methods = useForm<CreateIncentiveFormData>({
    // @ts-ignore
    resolver: yupResolver(createIncentiveSchema),
    defaultValues: {
      currency: undefined,
      startDate: undefined,
      endDate: undefined,
      stakeTokenAddress: undefined,
      amount: undefined,
    },
    mode: 'onChange',
  })

  const {
    formState: { isValid, isValidating },
    watch,
  } = methods

  // @ts-ignore
  const [currency, amount] = watch(['currency', 'amount'])

  const amountAsEntity = useMemo(() => {
    if (!currency || !amount) return undefined

    let value = undefined
    try {
      value = Amount.fromRawAmount(currency, JSBI.BigInt(parseUnits(amount, currency.decimals).toString()))
    } catch (e) {
      console.debug(e)
    }

    return value
  }, [amount, currency])

  const onSubmit: SubmitHandler<CreateIncentiveFormData> = useCallback(
    async (data) => {
      if (!amountAsEntity || !address || !data?.currency) return

      // Can cast here safely since input must have been validated already
      const _data = data as CreateIncentiveFormDataValidated

      setError(undefined)

      try {
        const response = await writeCreateIncentive({
          args: [
            _data.stakeTokenAddress,
            _data.currency.isToken ? _data.currency.address : '',
            amountAsEntity.quotient.toString(),
            new Date(_data.startDate).getTime() / 1000, //TODO: should not be saved as string, should be date
            new Date(_data.endDate).getTime() / 1000,
          ],
        })

        createToast({
          title: 'Create incentive',
          description: `You have successfully created a incentive`,
          // promise: data,
        })
      } catch (e: any) {
        setError(e.message)

        // log.tenderly({
        //   chainId: activeChain?.id,
        //   from: account.address,
        //   to: '0x1CeD9B90aa573849b42ADAC7204860823c290dAc',
        //   // data: batchAction({ contract, actions }),
        //   data: response,
        //   value: amountAsEntity.currency.isNative ? amountAsEntity.quotient.toString() : '0',
        // })
      }
    },
    [address, amountAsEntity, writeCreateIncentive]
  )

  return (
    <>
      <FormProvider {...methods}>
        <Form header="Create Incentive" onSubmit={methods.handleSubmit(onSubmit)}>
          <GeneralDetailsSection />
          <IncentiveAmountDetails />
          <Form.Buttons>
            <Approve
              components={
                <Approve.Components>
                  {/* <Approve.Bentobox address={contract?.address} onSignature={setSignature} /> */}
                  <Approve.Token amount={amountAsEntity} address={activeChain?.id ? contract.address : undefined} />
                </Approve.Components>
              }
              render={({ approved }) => (
                <Button
                  type="submit"
                  variant="filled"
                  color="gradient"
                  disabled={isWritePending || !approved || !isValid || isValidating}
                >
                  {isWritePending ? <Dots>Confirm transaction</Dots> : 'Create incentive'}
                </Button>
              )}
            />
          </Form.Buttons>
        </Form>
      </FormProvider>
    </>
  )
}
