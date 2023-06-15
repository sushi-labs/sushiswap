'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { ChainId } from '@sushiswap/chain'
import { Button, classNames, Loader, Typography } from '@sushiswap/ui'
import { BackgroundImageMakerField, Form, ImageCanvas, NetworkModal, SizeSlider, UploadImageField } from './components'
import stringify from 'fast-json-stable-stringify'
import { addressValidator, useTokenData } from './lib'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

enum SubmitState {
  Nothing = 'nothing',
  Loading = 'Loading',
  Error = 'error',
  Success = 'success',
}

const schema = yup.object().shape({
  tokenAddress: addressValidator.required('Please enter a valid ERC20-address'),
  background: yup.string(),
  logoSize: yup.number(),
  logoFile: yup.string(),
  listType: yup.string(),
})

export interface FormType {
  tokenAddress: string
  background: string
  logoUri: string
  logoFile: Blob
  logoSize: number
  listType: 'default-token-list' | 'community-token-list'
}

export default function Partner() {
  const methods = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      logoSize: 128,
      listType: 'default-token-list',
    },
  })
  const { watch } = methods
  const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM)
  // @ts-ignore
  const [tokenAddress, logoUri, logoFile, background, listType] = watch([
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

    const result = await fetch('/api/partner/submitToken', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: stringify({
        tokenAddress,
        tokenData,
        tokenIcon: canvasRef.current?.toDataURL(),
        chainId,
        listType,
      }),
    })

    const data = await result.json()

    switch (result.status) {
      case 200:
        setSubmitState({ state: SubmitState.Success, data })
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
      <Form {...(methods as any)} onSubmit={() => {}}>
        <Form.Card className={submitState?.error ? '!border-red/40' : ''}>
          <Form.Section columns={6} header={<Form.Section.Header header="Submit your request" />}>
            <div className="col-span-6">
              <Typography weight={600} className="mb-2">
                Network
              </Typography>
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
              <Typography weight={600}>Logo</Typography>
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
              <Typography weight={600}>Background color</Typography>
              <BackgroundImageMakerField />
            </div>
            <div
              className={classNames(
                'col-span-3 border-l border-slate-700 pl-7 space-y-3',
                !logoFile ? 'hidden' : 'block'
              )}
            >
              <Typography weight={600}>Preview</Typography>
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
                variant="filled"
                color="gray"
                onClick={onSubmit}
                type="button"
                fullWidth
              >
                {errors.length === 0 || errors.length > 1 ? 'Submit' : errors[0]}
              </Button>
            </div>
            {submitState?.error && (
              <Typography weight={600} variant="sm" className="col-span-6 text-center text-red">
                {submitState?.error}
              </Typography>
            )}
            {submitState?.data && (
              <div className="flex flex-col col-span-6 gap-5 p-4 border rounded-xl border-slate-700">
                <div className="flex flex-col gap-1">
                  <Typography variant="sm" weight={600}>
                    List pull request
                  </Typography>
                  <Typography variant="sm" className="text-blue-400 cursor-pointer hover:text-blue-600">
                    <a target="_blank" rel="noreferrer" href={submitState.data?.listPr}>
                      {submitState.data?.listPr}
                    </a>
                  </Typography>
                </div>
              </div>
            )}
          </Form.Section>
        </Form.Card>
      </Form>
      <Typography variant="xs" weight={300} className="flex justify-center text-center">
        I understand that filing an issue or adding liquidity does not guarantee addition to the Sushi default token
        list. I will not ping the Discord about this listing request.
      </Typography>
    </div>
  )
}
