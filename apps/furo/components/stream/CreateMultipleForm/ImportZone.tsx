import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { Native, Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dropzone, Typography } from '@sushiswap/ui'
import { useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useNetwork } from 'wagmi'
import { fetchToken, FetchTokenResult } from 'wagmi/actions'

import { CreateMultipleStreamFormData, CreateStreamFormData } from '../types'

export const ImportZone = () => {
  const { chain } = useNetwork()
  const { control } = useFormContext<CreateMultipleStreamFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { append } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
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

            const rows: CreateStreamFormData[] = []

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
                const [tokenAddress, fundSource, amount, recipient, startDate, endDate] = cur.split(',')
                const [sMM, sDD, sYYYY] = startDate.split('-')
                const [eMM, eDD, eYYYY] = endDate.split('-')

                rows.push({
                  currency: tokenMap[tokenAddress.toLowerCase()] || Native.onChain(chain.id),
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient,
                  amount,
                  startDate: new Date(+sYYYY, +sMM, +sDD).toISOString().slice(0, 16),
                  endDate: new Date(+eYYYY, +eMM, +eDD).toISOString().slice(0, 16),
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
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET, 1 = BentoBox),Amount,Recipient,Start Date (DD-MM-YYYY),End Date (DD-MM-YYYY)\n0x0000000000000000000000000000000000000000,0,0.0001,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,08-08-2022,10-08-2022'
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_stream_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <>
      <div className="flex flex-col gap-3">
        <Typography weight={700}>Quick Import</Typography>
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
