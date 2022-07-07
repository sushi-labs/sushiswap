import { AddressZero } from '@ethersproject/constants'
import { DownloadIcon } from '@heroicons/react/outline'
import { PlusCircleIcon } from '@heroicons/react/solid'
import { Native, Token } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { Button, Dropzone, IconButton, Typography } from '@sushiswap/ui'
import { fetchToken, FetchTokenResult } from '@wagmi/core'
import { useCallback } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import { TableSectionRow } from './TableSectionRow'
import { CreateStreamFormData, StreamData } from './types'

export const TableSection = () => {
  const { chain } = useNetwork()
  const { control } = useFormContext<CreateStreamFormData>()

  // TODO: cast as never until
  // https://github.com/react-hook-form/react-hook-form/issues/4055#issuecomment-950145092 gets fixed
  const { fields, append, remove } = useFieldArray({
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

            const rows: StreamData[] = []

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
                rows.push({
                  currency: tokenMap[tokenAddress.toLowerCase()] || Native.onChain(chain.id),
                  fundSource: Number(fundSource) === 0 ? FundSource.WALLET : FundSource.BENTOBOX,
                  recipient,
                  amount,
                  startDate: new Date(startDate).toISOString().slice(0, 16),
                  endDate: new Date(endDate).toISOString().slice(0, 16),
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
      'data:text/csv;charset=utf-8,Currency Address,Funding Source (0 = WALLET, 1 = BentoBox),Amount,Recipient,Start Date (DD-MM-YYYY),End Date (DD-MM-YYYY)\n'
    )
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'sushi_stream_def_example.csv')
    document.body.appendChild(link)
    link.click()
  }, [])

  return (
    <div className="my-6 space-y-6">
      <div className="relative">
        <Dropzone
          accept={{
            'text/csv': ['.csv'],
          }}
          onDrop={onDrop}
        />
        <div className="absolute right-3 top-3">
          <Button onClick={downloadExample} size="xs" color="gray" startIcon={<DownloadIcon width={16} height={16} />}>
            Example
          </Button>
        </div>
      </div>
      <div className="w-full overflow-auto lg:overflow-visible max-w-5xl">
        <div className="grid lg:grid-cols-[120px_120px_120px_222px_185px_185px] grid-cols-[30px_120px_110px_110px_192px_185px_185px_60px] gap-y-3 gap-x-2 border-b border-slate-200/5 py-2">
          <div className="lg:absolute" />
          <Typography variant="sm" weight={700} className="text-slate-500">
            Currency
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Fund Source
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Amount
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Recipient
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            Start Date
          </Typography>
          <Typography variant="sm" weight={700} className="text-slate-500">
            End Date
          </Typography>
          <div className="lg:absolute" />
        </div>
        <div className="flex flex-col gap-2 pt-3">
          {fields.map((field, index) => (
            <TableSectionRow index={index} key={field.id} control={control} onRemove={remove} onCopy={append} />
          ))}
        </div>
      </div>
      <IconButton
        className="mt-2"
        onClick={() => {
          append({
            fundSource: FundSource.WALLET,
            amount: undefined,
            recipient: '',
            startDate: '',
            endDate: '',
          })
        }}
      >
        <PlusCircleIcon width={24} height={24} />
      </IconButton>
    </div>
  )
}
