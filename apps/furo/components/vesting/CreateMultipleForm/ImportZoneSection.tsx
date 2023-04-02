import { getAddress, isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from '@sushiswap/chain'
import { Native, Token, Type } from '@sushiswap/currency'
import { FundSource, useIsMounted } from '@sushiswap/hooks'
import { Button, Dropzone, NetworkIcon, Typography } from '@sushiswap/ui'
import { Wallet } from '@sushiswap/wagmi'
import { FC, useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Address, useAccount } from '@sushiswap/wagmi'
import { fetchToken, FetchTokenResult } from '@sushiswap/wagmi'

import { CreateVestingFormSchemaType, stepConfigurations } from '../CreateForm'
import { useImportErrorContext } from './ImportErrorContext'
import { CreateMultipleVestingFormSchemaType } from './schema'

interface ImportZoneSection {
  chainId: ChainId
}

export const ImportZoneSection: FC<ImportZoneSection> = ({ chainId }) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()
  const { errors, setErrors } = useImportErrorContext<CreateMultipleVestingFormSchemaType>()
  const { control, trigger, watch } = useFormContext<CreateMultipleVestingFormSchemaType>()

  const { append } = useFieldArray({
    control,
    name: 'vestings',
    shouldUnregister: true,
  })

  const vestings = watch('vestings')
  const nrOfVests = vestings?.length || 0

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
              arr.reduce<Promise<void | FetchTokenResult>[]>((acc, cur, index) => {
                if (cur !== '') {
                  const [tokenAddress] = cur.split(',')
                  if (tokenAddress !== AddressZero) {
                    acc.push(
                      fetchToken({
                        address: tokenAddress as Address,
                        chainId,
                      }).catch(() => {
                        if (!errors.vestings?.[index]) {
                          errors.vestings = []
                        }

                        errors.vestings[index + nrOfVests] = {
                          currency: {
                            type: 'custom',
                            message: `${tokenAddress} was not found`,
                          },
                        }
                      })
                    )
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

            arr?.forEach((cur, index) => {
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

                if (!errors.vestings?.[index]) {
                  errors.vestings = []
                }

                let _startDate: Date | undefined = new Date(Number(startDate) * 1000)
                let _cliffEndDate: Date | null = new Date(Number(cliffEndDate) * 1000)
                let _recipient: string | undefined = recipient
                const _currency: Type | undefined =
                  tokenAddress.toLowerCase() === AddressZero.toLowerCase()
                    ? Native.onChain(chainId)
                    : tokenMap?.[tokenAddress.toLowerCase()]

                if (!isAddress(recipient)) {
                  _recipient = undefined
                  errors.vestings[index + nrOfVests] = {
                    ...errors.vestings[index + nrOfVests],
                    recipient: {
                      type: 'custom',
                      message: `${recipient} is not a valid address`,
                    },
                  }
                }

                if (isNaN(_startDate.getTime())) {
                  _startDate = undefined
                  errors.vestings[index + nrOfVests] = {
                    ...errors.vestings[index + nrOfVests],
                    startDate: {
                      type: 'custom',
                      message: `${startDate} is not a valid unix timestamp`,
                    },
                  }
                }

                if (Number(cliff) === 1 && isNaN(_cliffEndDate.getTime())) {
                  _cliffEndDate = null
                  errors.vestings[index + nrOfVests] = {
                    ...errors.vestings[index + nrOfVests],
                    cliff: {
                      ...errors.vestings[index + nrOfVests]?.cliff,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      cliffEndDate: {
                        type: 'custom',
                        message: `${cliffEndDate} is not a valid unix timestamp`,
                      },
                    },
                  }
                }

                rows.push({
                  id: nanoid(),
                  currency: _currency,
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient: _recipient,
                  startDate: _startDate,
                  cliff:
                    Number(cliff) === 1
                      ? {
                          cliffEnabled: true,
                          cliffAmount: cliffAmount,
                          cliffEndDate: _cliffEndDate,
                        }
                      : {
                          cliffEnabled: false,
                        },
                  stepPayouts: Number(stepPayouts),
                  stepAmount,
                  stepConfig: stepConfigurations[Number(stepConfig)],
                })
              }
            }, [])

            append(rows)
            await trigger()
            setErrors(errors)
          }
        }

        reader.readAsText(currentFile)
      })
    },
    [append, chainId, errors, nrOfVests, setErrors, trigger]
  )

  const downloadExample = useCallback(() => {
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET 1 = BentoBox),Recipient,Start Date (Unix Epoch Timestamp),Cliff(0 = DISABLED 1 = ENABLED),Cliff End Date (Unix Epoch Timestamp),Cliff Amount,Payout Interval(0=WEEKLY 1=BIWEEKLY 2=MONTHLY 3=QUARTERLY 4=YEARLY),Number of Intervals,Payout Per Interval\n0x0000000000000000000000000000000000000000,0,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,1661440124,1,1661872124,0.0001,0,10,0.0001\n'
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_vesting_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <div className="flex flex-col md:grid md:grid-cols-[296px_auto] gap-y-10 lg:gap-20">
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
            className="px-6 mt-4"
            startIcon={<DownloadIcon width={20} height={20} />}
          >
            Example
          </Button>
        </div>
      </div>
      <div className="relative grid">
        {isMounted && !address && (
          <div className="absolute inset-0 z-10 backdrop-blur-[2px] flex justify-center items-center">
            <Wallet.Button size="sm" className="shadow-md shadow-black/40">
              Connect Wallet
            </Wallet.Button>
          </div>
        )}
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
    </div>
  )
}
