'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ChainId } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Loader } from '@sushiswap/ui/components/loader'
import stringify from 'fast-json-stable-stringify'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { BackgroundImageMakerField, Form, ImageCanvas, NetworkModal, SizeSlider, UploadImageField } from './components'
import { ListType, SubmiTokenSchema } from './config'
import { useTokenData } from './lib'

enum SubmitState {
  Nothing = 'nothing',
  Loading = 'Loading',
  Error = 'error',
  Success = 'success',
}

export interface FormType {
  tokenAddress: string
  background: string
  logoUri: string
  logoFile: Blob
  logoSize: number
  listType: string
}

export default function Partner() {
  const form = useForm<FormType>({
    resolver: zodResolver(SubmiTokenSchema),
    defaultValues: {
      logoSize: 128,
      listType: ListType.DEFAULT,
    },
  })
  const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM)

  // @ts-ignore
  const [tokenAddress, logoUri, logoFile, background, listType] = form.watch([
    'tokenAddress',
    'logoUri',
    'logoFile',
    'background',
    'listType',
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [submitState, setSubmitState] = useState<{
    state: SubmitState
    data?: { listPr: string }
    error?: string
  }>({ state: SubmitState.Nothing })

  const { data: tokenData, isValidating: tokenDataLoading } = useTokenData(tokenAddress, chainId)

  const onSubmit = async () => {
    setSubmitState({ state: SubmitState.Loading })

    const result = await fetch('/partner/api/submitToken', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: stringify({
        token: {
          address: tokenAddress,
          ...tokenData,
        },
        tokenIcon: canvasRef.current?.toDataURL(),
        chainId,
        listType,
      } as (typeof SubmiTokenSchema)['_output']),
    })

    const data = await result.json()

    switch (result.status) {
      case 200:
        setSubmitState({ state: SubmitState.Success, data })
        break
      case 400:
        setSubmitState({
          state: SubmitState.Error,
          error: JSON.stringify(data?.error) ?? 'Unknown error.',
        })
        break
      case 500:
        setSubmitState({
          state: SubmitState.Error,
          error: data?.error ?? 'Unknown error.',
        })
    }
  }

  const errors = [
    tokenAddress && !tokenData?.symbol ? 'Token not found' : undefined,
    !logoUri ? 'No logo uploaded' : undefined,
    !background ? 'No background color provided' : undefined,
  ].filter((el) => !!el)

  return (
    <div className="flex flex-col max-w-lg space-y-2">
      <Form {...form} onSubmit={() => undefined}>
        <Form.Card className={submitState?.error ? '!border-red/40' : ''}>
          <Form.Section columns={6} header={<Form.Section.Header header="Submit your request" />}>
            <div className="flex items-center col-span-6 space-x-4">
              <span className="font-medium">Network</span>
              <NetworkModal chainId={chainId} setChainId={setChainId} />
            </div>
            <div className="col-span-6">
              <Form.TextField
                name="tokenAddress"
                label="Token address"
                helperText={
                  tokenAddress && tokenData?.symbol ? (
                    <Form.HelperText className="!text-green">
                      Found token {tokenData.symbol} ({tokenData.decimals} decimals)
                    </Form.HelperText>
                  ) : tokenDataLoading ? (
                    <Form.HelperText className="!text-green">
                      <Loader />
                    </Form.HelperText>
                  ) : tokenAddress ? (
                    <Form.HelperText className="!text-red">Token not found</Form.HelperText>
                  ) : (
                    'Please enter the address of your token'
                  )
                }
                placeholder="0x..."
              />
            </div>
            <div className="col-span-6">
              <span className="font-medium">Logo</span>
              <div className="flex gap-6 mt-2">
                <div className="flex flex-grow">
                  <UploadImageField />
                </div>
              </div>
            </div>
            {logoFile && (
              <div className="col-span-6">
                <SizeSlider />
              </div>
            )}
            <div className="col-span-3 space-y-3">
              <span className="font-medium">Background color</span>
              <BackgroundImageMakerField />
            </div>
            <div
              className={classNames(
                'col-span-3 border-l border-slate-700 pl-7 space-y-3',
                !logoFile ? 'hidden' : 'block'
              )}
            >
              <span className="font-medium">Preview</span>
              <ImageCanvas size={128} canvasRef={canvasRef} className="rounded-full" />
            </div>
            {/* <div className="flex col-span-6">
              <Button
                fullWidth
                color="gray"
                className={classNames('rounded-r-none', listType !== 'default-token-list' && 'opacity-40')}
                onClick={() => methods.setValue('listType', 'default-token-list')}
              >
                Default List
              </Button>
              <Button
                fullWidth
                color="gray"
                className={classNames('rounded-l-none', listType !== 'community-token-list' && 'opacity-40')}
                onClick={() => methods.setValue('listType', 'community-token-list')}
              >
                Community List
              </Button>
            </div> */}
            <div className="flex justify-end col-span-6">
              <Button
                disabled={(tokenAddress && !tokenData?.symbol) || !logoUri || !background}
                loading={submitState.state === SubmitState.Loading}
                variant="secondary"
                onClick={onSubmit}
                type="button"
                fullWidth
              >
                {errors.length === 0 || errors.length > 1 ? 'Submit' : errors[0]}
              </Button>
            </div>
            {submitState?.error && (
              <span className="col-span-6 text-sm font-medium text-center text-red">{submitState?.error}</span>
            )}
            {submitState?.data && (
              <div className="flex flex-col col-span-6 gap-5 p-4 border rounded-xl border-slate-700">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">List pull request</span>
                  <span className="text-sm text-blue-400 cursor-pointer hover:text-blue-600">
                    <a target="_blank" rel="noreferrer" href={submitState.data?.listPr}>
                      {submitState.data?.listPr}
                    </a>
                  </span>
                </div>
              </div>
            )}
          </Form.Section>
        </Form.Card>
      </Form>
      <span className="flex justify-center text-xs text-center">
        I understand that filing an issue or adding liquidity does not guarantee addition to the Sushi default token
        list. I will not ping the Discord about this listing request.
      </span>
    </div>
  )
}
