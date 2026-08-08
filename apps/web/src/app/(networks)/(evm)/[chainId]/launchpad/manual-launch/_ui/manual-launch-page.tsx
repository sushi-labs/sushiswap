'use client'

import { CubeTransparentIcon } from '@heroicons/react/24/outline'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  Button,
  Container,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Message,
  TextField,
} from '@sushiswap/ui'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TOAST_AUTOCLOSE_TIME } from 'src/lib/perps'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { Checker } from 'src/lib/wagmi/systems/checker'
import type { EvmAddress } from 'sushi/evm'
import { useConnection, useDeployContract, usePublicClient } from 'wagmi'
import { PerpsCard } from '~evm/perps/_ui/_common/perps-card'
import {
  SUSHI_LAUNCHPAD_TOKEN_ABI,
  SUSHI_LAUNCHPAD_TOKEN_BYTECODE,
} from '../../_lib/sushi-launchpad-token'
import { DetailList } from '../../_ui/detail-list'
import { PageHeading } from '../../_ui/page-heading'
import type { LaunchpadChainId } from '../../constants'

interface ManualLaunchForm {
  name: string
  symbol: string
}

function isWithinByteLimit(value: string, maximumBytes: number): boolean {
  return new TextEncoder().encode(value.trim()).length <= maximumBytes
}

export function ManualLaunchPage({
  chainId,
}: {
  chainId: LaunchpadChainId
}) {
  const { address: account } = useConnection()
  const publicClient = usePublicClient({ chainId })
  const { mutateAsync: deployContractAsync } = useDeployContract()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployedTokenAddress, setDeployedTokenAddress] = useState<EvmAddress>()
  const methods = useForm<ManualLaunchForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      symbol: '',
    },
  })

  async function deployToken(values: ManualLaunchForm): Promise<void> {
    if (!account || !publicClient) return

    const name = values.name.trim()
    const symbol = values.symbol.trim()
    setIsDeploying(true)
    setDeployedTokenAddress(undefined)

    try {
      const hash = await deployContractAsync({
        abi: SUSHI_LAUNCHPAD_TOKEN_ABI,
        bytecode: SUSHI_LAUNCHPAD_TOKEN_BYTECODE,
        args: [name, symbol, account],
        chainId,
      })
      const receiptPromise = publicClient.waitForTransactionReceipt({ hash })
      const timestamp = Date.now()

      void createToast({
        account,
        type: 'mint',
        chainId,
        txHash: hash,
        promise: receiptPromise,
        summary: {
          pending: `Deploying ${symbol}`,
          completed: `${symbol} was deployed successfully`,
          failed: `Something went wrong deploying ${symbol}`,
        },
        timestamp,
        groupTimestamp: timestamp,
        autoClose: TOAST_AUTOCLOSE_TIME,
        variant: 'perps',
      })

      const receipt = await receiptPromise
      if (!receipt.contractAddress) {
        throw new Error(
          'The deployment was confirmed, but the token address was not returned.',
        )
      }

      setDeployedTokenAddress(receipt.contractAddress)
    } catch (error) {
      if (!isUserRejectedError(error)) {
        createErrorToast(
          error instanceof Error ? error.message : 'Could not deploy token',
          true,
        )
      }
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <Container maxWidth="5xl" className="w-full px-4 py-10 sm:py-14">
      <PageHeading
        eyebrow="Manual launch"
        title="Deploy a token directly"
        description="Create a fixed-supply SushiLaunchpadToken without opening a market. The connected wallet receives the complete supply."
      />

      <Form {...methods}>
        <form
          className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
          onSubmit={methods.handleSubmit(deployToken)}
        >
          <PerpsCard className="p-5 sm:p-7" fullWidth>
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-perps-blue/10 text-perps-blue">
                <CubeTransparentIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-perps-muted">
                  Onchain identity
                </h2>
                <p className="mt-1 text-sm leading-6 text-perps-muted-50">
                  Name and symbol are permanent after deployment.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="name"
                rules={{
                  validate: {
                    required: (value) =>
                      value.trim().length > 0 || 'Enter a token name',
                    length: (value) =>
                      isWithinByteLimit(value, 64) ||
                      'Token name must be 64 UTF-8 bytes or fewer',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token name</FormLabel>
                    <FormControl>
                      <TextField
                        {...field}
                        type="text"
                        placeholder="e.g. Nori Club"
                        className="!bg-white/[0.04] !text-perps-muted"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="symbol"
                rules={{
                  validate: {
                    required: (value) =>
                      value.trim().length > 0 || 'Enter a symbol',
                    length: (value) =>
                      isWithinByteLimit(value, 16) ||
                      'Symbol must be 16 UTF-8 bytes or fewer',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <TextField
                        {...field}
                        type="text"
                        placeholder="e.g. NORI"
                        className="!bg-white/[0.04] !text-perps-muted"
                        onChange={(event) =>
                          field.onChange(event.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-7 rounded-xl bg-white/[0.04] p-4 text-sm leading-6 text-perps-muted-50 shadow-[inset_1px_1px_0_rgba(255,255,255,0.05)]">
              This deploys the same fixed-supply ERC-20 implementation used by
              Sushi Launchpad. It does not create a pool, add liquidity, or add
              the token to the launchpad catalog.
            </div>

            {deployedTokenAddress ? (
              <Message
                variant="success"
                className="mt-6 min-w-0 max-w-full break-words"
              >
                Token deployed at {deployedTokenAddress}
              </Message>
            ) : null}
          </PerpsCard>

          <PerpsCard className="p-5" fullWidth>
            <div className="text-sm font-semibold text-perps-muted">
              Deployment details
            </div>
            <DetailList
              className="mt-4"
              items={[
                { label: 'Total supply', value: '1,000,000,000' },
                { label: 'Decimals', value: '18' },
                { label: 'Recipient', value: 'Connected wallet' },
                { label: 'Market', value: 'Not created' },
              ]}
            />

            <Checker.Connect
              namespace="evm"
              fullWidth
              size="xl"
              variant="perps-default"
              className="mt-6"
              type="button"
            >
              <Checker.Network
                chainId={chainId}
                fullWidth
                size="xl"
                variant="perps-default"
                type="button"
              >
                <Button
                  type="submit"
                  fullWidth
                  size="xl"
                  variant="perps-default"
                  disabled={!methods.formState.isValid || isDeploying}
                >
                  {isDeploying ? 'Deploying token…' : 'Deploy token'}
                </Button>
              </Checker.Network>
            </Checker.Connect>
          </PerpsCard>
        </form>
      </Form>
    </Container>
  )
}
