import { getAddress, isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/components/button'
import { Dropzone } from '@sushiswap/ui/components/dropzone'
import { FormSection } from '@sushiswap/ui/components/form'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { Address, fetchToken, FetchTokenResult } from '@sushiswap/wagmi'
import { nanoid } from 'nanoid'
import dynamic from 'next/dynamic'
import { FC, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { CreateMultipleStreamFormSchemaType, CreateStreamFormSchemaType } from '../schema'

interface ImportZoneSection {
  chainId: ChainId
}

const Component: FC<ImportZoneSection> = ({ chainId }) => {
  const { control, trigger } = useFormContext<CreateMultipleStreamFormSchemaType>()
  const { replace } = useFieldArray({
    control,
    name: 'streams',
    shouldUnregister: true,
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = async () => {
          const { result } = reader
          if (typeof result === 'string') {
            // Split and remove header
            const arr = result.split(/\r?\n/)

            // If the CSV has a header, remove the first line
            if (arr.length > 0) {
              const [tokenAddress] = arr[0].split(',')
              try {
                getAddress(tokenAddress)
              } catch (e) {
                arr.shift()
              }
            }

            const rows: CreateStreamFormSchemaType[] = []
            const tokens = await Promise.all(
              arr.reduce<Promise<void | FetchTokenResult>[]>((acc, cur) => {
                if (cur !== '') {
                  const [tokenAddress] = cur.split(',') as [Address]
                  if (tokenAddress !== AddressZero) {
                    acc.push(fetchToken({ address: tokenAddress, chainId }).catch())
                  }
                }

                return acc
              }, [])
            )

            const tokenMap = tokens?.reduce<Record<string, Token>>((acc, result) => {
              if (result) {
                const { address, symbol, decimals } = result
                acc[address.toLowerCase()] = new Token({
                  address,
                  symbol,
                  decimals,
                  chainId,
                })
              }
              return acc
            }, {})

            arr?.forEach((cur) => {
              if (cur !== '') {
                const [tokenAddress, fundSource, amount, recipient, startDate, endDate] = cur.split(',')
                let _startDate: Date | null = new Date(Number(startDate) * 1000)
                let _endDate: Date | null = new Date(Number(endDate) * 1000)
                let _recipient: Address | undefined = recipient as Address
                const _currency: Type | undefined =
                  tokenAddress.toLowerCase() === AddressZero.toLowerCase()
                    ? Native.onChain(chainId)
                    : tokenMap?.[tokenAddress.toLowerCase()]

                if (!isAddress(recipient)) {
                  _recipient = undefined
                }

                if (isNaN(_startDate.getTime())) {
                  _startDate = null
                }

                if (isNaN(_endDate.getTime())) {
                  _endDate = null
                }

                rows.push({
                  id: nanoid(),
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient: _recipient,
                  currency: _currency,
                  amount,
                  dates: {
                    startDate: _startDate || new Date(0),
                    endDate: _endDate || new Date(0),
                  },
                })
              }
            }, [])

            replace(rows)
            await trigger()
          }
        }

        reader.readAsText(file)
      })
    },
    [replace, chainId, trigger]
  )

  const downloadExample = useCallback(() => {
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET 1 = BentoBox),Amount,Recipient,Start Date (Unix Epoch Timestamp),End Date (Unix Epoch Timestamp)\n0x0000000000000000000000000000000000000000,0,0.0001,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,1661440124,1661872124'
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_stream_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <FormSection
      title="Quick Import"
      description={
        <div className="flex flex-col gap-6">
          <span>
            Autofill your list by uploading a .csv file to save time and effort! Please use the demo file to check if
            your data is formatted correctly.
          </span>
          <div>
            <Button size="lg" type="button" onClick={downloadExample} icon={DownloadIcon}>
              Example
            </Button>
          </div>
        </div>
      }
    >
      <div className="relative grid">
        <div className="absolute -mt-2 -ml-2">
          <NetworkIcon chainId={chainId} className="w-6 h-6" />
        </div>
        <Dropzone
          accept={{
            'text/csv': ['.csv'],
          }}
          onDrop={onDrop}
        />
      </div>
    </FormSection>
  )
}

export const ImportZoneSection = dynamic(() => Promise.resolve(Component), { ssr: false })
