import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import chains from '@sushiswap/chain'
import { Native, Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dropzone, Typography } from '@sushiswap/ui'
import { useCallback, useRef } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useNetwork } from 'wagmi'
import { fetchToken, FetchTokenResult } from 'wagmi/actions'

import { CreateMultipleStreamFormData, CreateStreamFormData } from '../types'

export const ImportZone = () => {
  const { chain } = useNetwork()
  const { control, trigger } = useFormContext<CreateMultipleStreamFormData>()
  const errors = useRef<string[][]>([])

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
              arr.reduce<Promise<void | FetchTokenResult>[]>((acc, cur, index) => {
                if (cur !== '') {
                  const [tokenAddress] = cur.split(',')
                  if (tokenAddress !== AddressZero) {
                    fetchToken({ address: tokenAddress, chainId: chain.id }).catch(() => {
                      if (!errors.current[index]) {
                        errors.current[index] = []
                      }
                      errors.current[index].push(
                        `${shortenAddress(tokenAddress)} was not found on ${chains[chain.id].name}`
                      )
                    })
                  }
                }

                return acc
              }, [])
            )

            const tokenMap = tokens?.reduce<Record<string, Token>>((acc, result) => {
              if (result) {
                const { address, symbol, decimals } = result
                acc[address.toLowerCase()] = new Token({ address, symbol, decimals, chainId: chain.id })
              }
              return acc
            }, {})

            arr?.forEach((cur, index) => {
              if (cur !== '') {
                const [tokenAddress, fundSource, amount, recipient, startDate, endDate] = cur.split(',')

                let _startDate = ''
                try {
                  _startDate = new Date(Number(startDate) * 1000).toISOString().slice(0, 16)
                } catch (e) {
                  errors.current[index].push('Start date must be in unix timestamp')
                }

                let _endDate = ''
                try {
                  _endDate = new Date(Number(endDate) * 1000).toISOString().slice(0, 16)
                } catch (e) {
                  errors.current[index].push('End date must be in unix timestamp')
                }

                if (![0, 1].includes(Number(fundSource))) {
                  errors.current[index].push('Fund source must be either 0 for Wallet or 1 for Bentobox')
                }

                rows.push({
                  currency:
                    tokenAddress.toLowerCase() === AddressZero.toLowerCase()
                      ? Native.onChain(chain.id)
                      : tokenMap?.[tokenAddress.toLowerCase()],
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient,
                  amount,
                  startDate: _startDate,
                  endDate: _endDate,
                })
              }
            }, [])

            append(rows)
            await trigger()
          }
        }

        reader.readAsText(file)
      })
    },
    // @ts-ignore
    [append, chain, trigger]
  )

  const downloadExample = useCallback(() => {
    const encodedUri = encodeURI(
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET, 1 = BentoBox),Amount,Recipient,Start Date (Unix Epoch Timestamp),End Date (Unix Epoch Timestamp)\n0x0000000000000000000000000000000000000000,0,0.0001,0x19B3Eb3Af5D93b77a5619b047De0EED7115A19e7,08-08-2022,10-08-2022'
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
