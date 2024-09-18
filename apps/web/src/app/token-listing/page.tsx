'use client'

import { CameraIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApplyForTokenList } from '@sushiswap/react-query'
import {
  Card,
  Container,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Label,
  LinkExternal,
  Message,
  NetworkSelector,
  SelectIcon,
  Separator,
  TextField,
  typographyVariants,
} from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { useCallback, useEffect } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { Chain, ChainId } from 'sushi/chain'
import { type Address, isAddress } from 'viem'

import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import {
  ApplyForTokenListListType,
  ApplyForTokenListTokenSchema,
  ApplyForTokenListTokenSchemaType,
} from './schema'

const Metrics = () => {
  return (
    <>
      <h2 className="text-sm font-medium leading-none dark:text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Metrics
      </h2>
      <Card>
        <div className="grid grid-cols-4 gap-4 p-3 text-sm text-muted-foreground">
          <span>Age</span>
          <span>Daily</span>
          <span>Market Cap</span>
          <span>Holder Count</span>
        </div>
      <Separator/>
        <div className="grid grid-cols-4 gap-4 p-3 text-sm">
          <span>23 Days</span>
          <span>$709k</span>
          <span>$400k</span>
          <span>510</span>
        </div>
      </Card>
    </>
  )
}

export default function Partner() {
  const methods = useForm<ApplyForTokenListTokenSchemaType>({
    mode: 'all',
    resolver: zodResolver(ApplyForTokenListTokenSchema),
    defaultValues: {
      chainId: ChainId.ETHEREUM,
      listType: ApplyForTokenListListType.DEFAULT,
      logoFile: '',
      tokenAddress: '',
    },
  })

  const [chainId, tokenAddress, logoFile] = methods.watch([
    'chainId',
    'tokenAddress',
    'logoFile',
  ])

  const { data: token, isError: isTokenError } = useTokenWithCache({
    address: tokenAddress as Address,
    chainId,
    enabled: isAddress(tokenAddress, { strict: false }),
  })
  const { mutate, isPending, data, status } = useApplyForTokenList()

  useEffect(() => {
    if (isTokenError)
      methods.setError('tokenAddress', {
        type: 'custom',
        message: 'Token not found',
      })
    else methods.clearErrors('tokenAddress')
  }, [methods, isTokenError])

  const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
    (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.addEventListener('load', () => {
          if (reader.result) {
            const imageAsBase64 = reader.result.toString()
            const image = document.createElement('img')
            image.src = imageAsBase64
            image.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = 128
              canvas.height = 128
              const context = canvas.getContext('2d', { alpha: false })
              if (context) {
                context.drawImage(image, 0, 0, canvas.width, canvas.height)
                const resizedImageAsBase64 = canvas.toDataURL('image/jpeg')
                methods.setValue('logoFile', resizedImageAsBase64)
              }
            }
          }
        })
      })
    },
    [methods],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'] },
    maxFiles: 1,
  })

  const onSubmit = (values: ApplyForTokenListTokenSchemaType) => {
    if (token?.symbol) {
      mutate({
        ...values,
        tokenName: token.name,
        tokenDecimals: token.decimals,
        tokenSymbol: token.symbol,
      })
    }
  }

  return (
    <>
      <div className="max-w-5xl px-4 py-16 mx-auto">
        <div className="flex flex-col">
          <h1 className={typographyVariants({ variant: 'h1' })}>
            Community List
          </h1>
          <p
            className={typographyVariants({
              variant: 'lead',
              className: 'max-w-[800px]',
            })}
          >
            Get your token verified by Sushi&apos;s Community.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-white/[0.02] border-t border-accent pt-4 pb-20 h-full">
        <Container maxWidth="5xl" className="px-4 py-10">
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-8 mt-4">
                <FormField
                  control={methods.control}
                  name="chainId"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <Label>
                        Network
                      </Label>
                      <FormControl>
                        <div>
                          <NetworkSelector
                            networks={SUPPORTED_CHAIN_IDS}
                            selected={value}
                            onSelect={onChange}
                          >
                            <Button
                              type="button"
                              variant="secondary"
                              className="!font-medium"
                            >
                              <NetworkIcon
                                chainId={value}
                                width={16}
                                height={16}
                              />
                              {Chain.from(value)?.name}
                              <SelectIcon />
                            </Button>
                          </NetworkSelector>
                        </div>
                      </FormControl>
                      <FormMessage>
                        The network your token is deployed on.
                      </FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="tokenAddress"
                  render={({ field: { onChange, value, onBlur, name } }) => {
                    return (
                      <FormItem className="flex-1">
                        <Label>
                          Token Address
                        </Label>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="0x.."
                            onValueChange={onChange}
                            value={value}
                            name={name}
                            onBlur={onBlur}
                            testdata-id="tokenAddress"
                            unit={token?.symbol}
                          />
                        </FormControl>
                        <FormMessage>
                          The contract address of your token.
                        </FormMessage>
                      </FormItem>
                    )
                  }}
                />
                <Metrics />
                <FormItem>
                  <Label>
                    Upload Icon
                  </Label>
                  <FormControl>
                    <div>
                      <div
                        {...getRootProps()}
                        className="relative w-20 h-20 overflow-hidden rounded-full cursor-pointer bg-secondary hover:bg-accent transition-background"
                      >
                        <input {...getInputProps()} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <CameraIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        {logoFile ? (
                          <img
                            className="!m-0"
                            alt="icon"
                            src={logoFile}
                            width={80}
                            height={80}
                          />
                        ) : null}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage>
                    Allowed formats: .jpeg, .jpg <br />
                    Minimum dimensions are 128x128.
                  </FormMessage>
                </FormItem>
                {status === 'error' ? (
                  <Message size="sm" variant="destructive">
                    Oops! Something went wrong when trying to execute your
                    request.
                  </Message>
                ) : null}
                {status === 'success' ? (
                  <Message size="sm" variant="success">
                    Successfully send your whitelisting request! View your
                    request{' '}
                    <LinkExternal href={data?.listPr} className="text-blue">
                      here
                    </LinkExternal>
                  </Message>
                ) : null}
                <div>
                  <Button
                    disabled={!methods.formState.isValid}
                    loading={isPending}
                    type="submit"
                  >
                    Submit for review
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Container>
      </div>
    </>
  )
}
