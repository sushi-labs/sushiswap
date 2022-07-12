import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { Native, Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dropzone, Typography } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useNetwork } from 'wagmi'
import { fetchToken, FetchTokenResult } from 'wagmi/actions'

import { stepConfigurations } from '../CreateForm'
import { CreateMultipleVestingFormData, CreateVestingFormData } from '../types'

export const ImportZone = () => {
  const { chain } = useNetwork()
  const { control } = useFormContext<CreateMultipleVestingFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { append } = useFieldArray({
    control,
    name: 'vestings',
  } as never)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!chain) {
        console.error('Not connected to network')
        return
      }

      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = async () => {
          const { result } = reader
          if (typeof result === 'string') {
            // Split and remove header
            const arr = result.split(/\r?\n/)
            arr.shift()

            const rows: CreateVestingFormData[] = []

            const tokens = await Promise.all(
              arr.reduce<Promise<FetchTokenResult>[]>((acc, cur) => {
                if (cur !== '') {
                  const [tokenAddress] = cur.split(',')
                  if (tokenAddress !== AddressZero) {
                    acc.push(fetchToken({ address: tokenAddress, chainId: chain.id, formatUnits: 'ether' }))
                  }
                }

                return acc
              }, [])
            )

            const tokenMap = tokens.reduce<Record<string, Token>>((acc, { address, decimals, symbol }) => {
              acc[address.toLowerCase()] = new Token({ address, symbol, decimals, chainId: chain.id })
              return acc
            }, {})

            arr?.forEach((cur) => {
              if (cur !== '') {
                const [
                  tokenAddress,
                  fundSource,
                  recipient,
                  startDate,
                  cliff,
                  cliffEndDate,
                  cliffAmount,
                  stepConfig,
                  stepPayouts,
                  stepAmount,
                ] = cur.split(',')
                const [sMM, sDD, sYYYY] = startDate.split('-')
                const [eMM, eDD, eYYYY] = cliffEndDate.split('-')

                rows.push({
                  currency: tokenMap[tokenAddress.toLowerCase()] ?? Native.onChain(chain.id),
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient,
                  startDate: new Date(+sYYYY, +sMM, +sDD).toISOString().slice(0, 16),
                  cliff: Number(cliff) === 1,
                  cliffAmount: Number(cliffAmount),
                  cliffEndDate: new Date(+eYYYY, +eMM, +eDD).toISOString().slice(0, 16),
                  stepPayouts: Number(stepPayouts),
                  stepAmount: Number(stepAmount),
                  stepConfig: stepConfigurations[Number(stepConfig)],
                  insufficientBalance: false,
                })
              }
            }, [])

            append(rows)
          }
        }

        reader.readAsText(file)
      })
    },
    [append, chain]
  )

  const downloadExample = useCallback(() => {
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET, 1 = BentoBox),Recipient,Start Date (DD-MM-YYYY),Cliff(0 = DISABLED, 1 = ENABLED),Cliff End Date (DD-MM-YYYY),Cliff Amount,Payout Interval(0=WEEKLY,1=BIWEEKLY,2=MONTHLY,3=QUARTERLY,4=YEARLY),Number of Intervals,Payout Per Interval\n0x0000000000000000000000000000000000000000,0,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,08-08-2022,1,10-08-2022,0.0001,0,10,0.0001\n'
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_vesting_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <>
      <div className="flex flex-col gap-3">
        <Typography weight={500}>Quick Import</Typography>
        <Typography variant="sm" weight={400} className="text-slate-400">
          Autofill your list by uploading a .csv file to save time and effort! Please use the demo file to check if your
          data is formatted correctly.
        </Typography>
        <div>
          <Button
            type="button"
            onClick={downloadExample}
            className="mt-4 px-6"
            startIcon={<DownloadIcon width={20} height={20} />}
          >
            Example
          </Button>
        </div>
      </div>
      <Dropzone
        accept={{
          'text/csv': ['.csv'],
        }}
        onDrop={onDrop}
      />
    </>
  )
}
