'use client'

import { CameraIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
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
  classNames,
  typographyVariants,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useCallback, useEffect, useMemo } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'
// import { type Address, isAddress } from 'viem'
import { useTokenAnalysis } from 'src/lib/hooks/api/useTokenAnalysis'
import { Chain, ChainId } from 'sushi/chain'

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/20/solid'
import { TokenAnalysis } from '@sushiswap/graph-client/data-api/queries/token-list-submission'
import { formatNumber, formatUSD } from 'sushi'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import {
  ApplyForTokenListTokenSchema,
  ApplyForTokenListTokenSchemaType,
} from './schema'

const Metrics = ({
  analysis,
}: {
  analysis: TokenAnalysis | undefined
}) => {
  return (
    <>
      <h2 className="text-sm font-medium leading-none dark:text-slate-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Metrics
      </h2>
      <Card>
        <div className="grid grid-cols-4 gap-4 p-3 text-sm text-muted-foreground">
          <span>
            Age {analysis ? ` (>${analysis.requirements.minimumAge} Days)` : ''}
          </span>
          <span>
            Daily Volume{' '}
            {analysis
              ? ` (>${formatUSD(analysis.requirements.minimumVolumeUSD24h)})`
              : ''}
          </span>
          <span>
            Market Cap{' '}
            {analysis
              ? ` (>${formatUSD(analysis.requirements.minimumMarketcapUSD)})`
              : ''}
          </span>
          <span>
            Holder Count{' '}
            {analysis ? ` (>${analysis.requirements.minimumHolders})` : ''}
          </span>
        </div>
        <Separator />
        <div className="grid grid-cols-4 gap-4 p-3 text-sm">
          <div
            className={classNames(
              'text-xs flex flex-row space-x-1',
              analysis &&
                analysis.metrics.age >= analysis.requirements.minimumAge
                ? 'text-[#139B6D]'
                : analysis &&
                    analysis.metrics.age < analysis.requirements.minimumAge
                  ? 'text-[#B4303C]'
                  : 'text-muted-foreground',
            )}
          >
            {analysis ? (
              <>
                {analysis.metrics.age >= analysis.requirements.minimumAge ? (
                  <CheckCircleIcon width={15} height={15} />
                ) : (
                  <ExclamationCircleIcon width={15} height={15} />
                )}
                <span>{analysis.metrics.age} Days</span>
              </>
            ) : (
              '-'
            )}
          </div>
          <div
            className={classNames(
              'text-xs flex flex-row space-x-1',
              analysis &&
                analysis.metrics.volumeUSD24h >=
                  analysis.requirements.minimumVolumeUSD24h
                ? 'text-[#139B6D]'
                : analysis &&
                    analysis.metrics.volumeUSD24h <
                      analysis.requirements.minimumVolumeUSD24h
                  ? 'text-[#B4303C]'
                  : 'text-muted-foreground',
            )}
          >
            {analysis ? (
              <>
                {analysis.metrics.volumeUSD24h >=
                analysis.requirements.minimumVolumeUSD24h ? (
                  <CheckCircleIcon width={15} height={15} />
                ) : (
                  <ExclamationCircleIcon width={15} height={15} />
                )}

                <span>{formatUSD(analysis.metrics.volumeUSD24h)}</span>
              </>
            ) : (
              '-'
            )}
          </div>

          <div
            className={classNames(
              'text-xs flex flex-row space-x-1',
              analysis &&
                analysis.metrics.marketcapUSD >=
                  analysis.requirements.minimumMarketcapUSD
                ? 'text-[#139B6D]'
                : analysis &&
                    analysis.metrics.marketcapUSD <
                      analysis.requirements.minimumMarketcapUSD
                  ? 'text-[#B4303C]'
                  : 'text-muted-foreground',
            )}
          >
            {analysis ? (
              <>
                {analysis.metrics.marketcapUSD >=
                analysis.requirements.minimumMarketcapUSD ? (
                  <CheckCircleIcon width={15} height={15} />
                ) : (
                  <ExclamationCircleIcon width={15} height={15} />
                )}

                <span>{formatUSD(analysis.metrics.marketcapUSD)}</span>
              </>
            ) : (
              '-'
            )}
          </div>

          <div
            className={classNames(
              'text-xs flex flex-row space-x-1',
              analysis &&
                analysis.metrics.holders >= analysis.requirements.minimumHolders
                ? 'text-[#139B6D]'
                : analysis &&
                    analysis.metrics.holders <
                      analysis.requirements.minimumHolders
                  ? 'text-[#B4303C]'
                  : 'text-muted-foreground',
            )}
          >
            {analysis ? (
              <>
                {analysis.metrics.holders >=
                analysis.requirements.minimumHolders ? (
                  <CheckCircleIcon width={15} height={15} />
                ) : (
                  <ExclamationCircleIcon width={15} height={15} />
                )}

                <span>{formatNumber(analysis.metrics.holders)}</span>
              </>
            ) : (
              '-'
            )}
          </div>
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
      logoFile: '',
      tokenAddress: undefined,
    },
  })
  const [chainId, tokenAddress, logoFile] = methods.watch([
    'chainId',
    'tokenAddress',
    'logoFile',
  ])

  const {
    data: analysis,
    isLoading,
    isError: isTokenError,
  } = useTokenAnalysis({
    address: tokenAddress,
    chainId,
  })

  const [isValid, reasoning] = useMemo(() => {
    if (!analysis) return [false, []]
    if (analysis.isExisting) return [false, ['Token is already approved.']]
    return [
      !analysis.isExisting && analysis.isPassingRequirements,
      analysis?.reasoning,
    ]
  }, [analysis])

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
    if (analysis?.token.symbol) {
      // mutate({
      //   ...values,
      //   tokenName: analysis.token.name,
      //   tokenDecimals: analysis.token.decimals,
      //   tokenSymbol: analysis.token.symbol,
      // })
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
                    <FormItem className='flex flex-row items-center gap-2'>
                      <Label>Select Network</Label>
                      <FormControl>
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
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="tokenAddress"
                  render={({ field: { onChange, value, onBlur, name } }) => {
                    return (
                      <FormItem className="flex-1 w-1/2">
                        <Label>Token Address</Label>
                        <FormControl>
                          <TextField
                            type="text"
                            placeholder="0x.."
                            onValueChange={onChange}
                            value={value}
                            name={name}
                            onBlur={onBlur}
                            testdata-id="tokenAddress"
                            unit={analysis?.token.symbol}
                          />
                        </FormControl>
                        <FormMessage>
                          The contract address of your token.
                        </FormMessage>
                      </FormItem>
                    )
                  }}
                />
                <Metrics analysis={analysis} />

                <Card className="p-4 space-y-4">
                  <div className='flex flex-row gap-1'>
                  <h3>Token Status</h3>
                  {analysis ? (
                    isValid ? (
                      <CheckCircleIcon
                        width={24}
                        height={24}
                        className="text-[#139B6D]"
                      />
                    ) : (
                      <ExclamationCircleIcon
                        width={24}
                        height={24}
                        className="text-[#B4303C]"
                      />
                    )
                  ) : (
                    <></>
                  )}
                  </div>
                  <Separator />
                  <ul className="pl-4 list-disc text-muted-foreground">
                    {reasoning.map((reason, i) => (
                      <li key={`reason-${i}`}>{reason}</li>
                    ))}
                  </ul>
                </Card>
                <Separator />
                <FormItem>
                  <Label>Upload Icon</Label>
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
                    <LinkExternal
                      href={'/pending-tokens'}
                      className="text-blue"
                    >
                      here
                    </LinkExternal>
                  </Message>
                ) : null}
                <div>
                  <Button
                    disabled={!methods.formState.isValid || !isValid}
                    // loading={ isLoading || isPending}
                    loading={isLoading}
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
