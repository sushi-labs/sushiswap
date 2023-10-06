import { getAddress, isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { ChainId } from 'sushi/chain'
import { Native, Token, Type } from 'sushi/currency'
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

import {
  CreateMultipleVestingFormSchemaType,
  CreateVestingFormSchemaType,
} from '../schema'

interface ImportZoneSection {
  chainId: ChainId
}

export const Component: FC<ImportZoneSection> = ({ chainId }) => {
  const { control, trigger } =
    useFormContext<CreateMultipleVestingFormSchemaType>()

  const { replace } = useFieldArray({
    control,
    name: 'vestings',
    shouldUnregister: true,
  })

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach((currentFile) => {
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

            const rows: CreateVestingFormSchemaType[] = []

            const tokens = await Promise.all(
              arr.reduce<Promise<void | FetchTokenResult>[]>((acc, cur) => {
                if (cur !== '') {
                  const [tokenAddress] = cur.split(',')
                  if (tokenAddress !== AddressZero) {
                    acc.push(
                      fetchToken({
                        address: tokenAddress as Address,
                        chainId,
                      }).catch(),
                    )
                  }
                }

                return acc
              }, []),
            )

            const tokenMap = tokens?.reduce<Record<string, Token>>(
              (acc, result) => {
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
              },
              {},
            )

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

                let _startDate: Date | undefined = new Date(
                  Number(startDate) * 1000,
                )
                let _cliffEndDate: Date | undefined = new Date(
                  Number(cliffEndDate) * 1000,
                )
                let _recipient: Address | undefined = recipient as Address
                const _currency: Type | undefined =
                  tokenAddress.toLowerCase() === AddressZero.toLowerCase()
                    ? Native.onChain(chainId)
                    : tokenMap?.[tokenAddress.toLowerCase()]

                if (!isAddress(recipient)) {
                  _recipient = undefined
                }

                if (isNaN(_startDate.getTime())) {
                  _startDate = undefined
                }

                if (Number(cliff) === 1 && isNaN(_cliffEndDate.getTime())) {
                  _cliffEndDate = undefined
                }

                rows.push({
                  id: nanoid(),
                  currency: _currency,
                  fundSource:
                    Number(fundSource) === 0
                      ? FundSource.WALLET
                      : FundSource.BENTOBOX,
                  recipient: _recipient,
                  startDate: _startDate,
                  cliffEnabled: Number(cliff) === 1,
                  cliffAmount: Number(cliff) === 1 ? cliffAmount : undefined,
                  cliffEndDate: Number(cliff) === 1 ? _cliffEndDate : undefined,
                  stepPayouts: Number(stepPayouts),
                  stepAmount,
                  stepConfig,
                })
              }
            }, [])

            replace(rows)
            await trigger()
          }
        }

        reader.readAsText(currentFile)
      })
    },
    [replace, chainId, trigger],
  )

  const downloadExample = useCallback(() => {
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET 1 = BentoBox),Recipient,Start Date (Unix Epoch Timestamp),Cliff(0 = DISABLED 1 = ENABLED),Cliff End Date (Unix Epoch Timestamp),Cliff Amount,Payout Interval(0=WEEKLY 1=BIWEEKLY 2=MONTHLY 3=QUARTERLY 4=YEARLY),Number of Intervals,Payout Per Interval\n0x0000000000000000000000000000000000000000,0,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,1661440124,1,1661872124,0.0001,2,10,0.0001\n',
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_vesting_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <FormSection
      title="Quick Import"
      description={
        <div className="flex flex-col gap-6">
          <span>
            Autofill your list by uploading a .csv file to save time and effort!
            Please use the demo file to check if your data is formatted
            correctly.
          </span>
          <div>
            <Button
              size="lg"
              type="button"
              icon={DownloadIcon}
              onClick={downloadExample}
            >
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

export const ImportZoneSection = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
