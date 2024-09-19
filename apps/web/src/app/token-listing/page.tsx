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
import { useEffect, useMemo } from 'react'
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
import { createSuccessToast, createToast } from '@sushiswap/notifications'

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
      logoUrl: '',
      tweetUrl: 'https://x.com/SushiSwap/status/1836208540035486031',
      address: undefined,
    },
  })
  const [chainId, address, logoUrl, tweetUrl] = methods.watch([
    'chainId',
    'address',
    'logoUrl',
    'tweetUrl',
  ])

  const {
    data: analysis,
    isLoading,
    isError: isTokenError,
  } = useTokenAnalysis({
    address,
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
      methods.setError('address', {
        type: 'custom',
        message: 'Token not found',
      })
    else methods.clearErrors('address')
  }, [methods, isTokenError])

  const onSubmit = async (values: ApplyForTokenListTokenSchemaType) => {
    try {
      const response = await fetch(
        'https://data.sushi.com/token-list/submit-token/v1',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      )
      console.log({ values, response })
      if (!response.ok) {
        throw new Error(`${response.statusText}`)
      }
      const data = await response.json()
      console.log('Response data:', data)
      methods.reset()
      // TODO: success toast?
    } catch (error: any) {
      console.error('Error:', error.message)
      // TODO: error toast?
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
                    <FormItem className="flex flex-row items-center gap-2">
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
                  name="address"
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
                            testdata-id="address"
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
                  <div className="flex flex-row gap-1">
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

                <FormField
                  control={methods.control}
                  name="logoUrl"
                  render={({ field: { onChange, value, onBlur, name } }) => {
                    return (
                      <FormItem className="flex-1">
                        <div>
                          <Label>Logo</Label>

                          <FormControl>
                            <TextField
                              type="text"
                              placeholder="https://assets.coingecko.com/coins/images/279/standard/ethereum.png"
                              onValueChange={onChange}
                              value={value}
                              name={name}
                              onBlur={onBlur}
                              testdata-id="logoUrl"
                            />
                          </FormControl>
                          <FormMessage>Logo URL of your token.</FormMessage>
                        </div>
                        <div>
                          <Label>Preview</Label>

                          {logoUrl ? (
                            <img
                              alt="logo"
                              src={logoUrl}
                              width={128}
                              height={128}
                            />
                          ) : (
                            <CameraIcon className="w-[128px] h-[128px] text-muted-foreground" />
                          )}
                        </div>
                      </FormItem>
                    )
                  }}
                />
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
