import type { Page, WebSocketRoute } from '@playwright/test'
import { NativeAddress } from 'src/lib/constants'
import {
  LIFI_PERPS_CHAIN_ID,
  LIFI_PERPS_USDC_ADDRESS,
  type LifiPerpsPreparedStep,
  type LifiPerpsRoute,
  type LifiPerpsStep,
  lifiPerpsStepSchema,
} from 'src/lib/perps/deposit/lifi-perps-schemas'
import { type EvmAddress, EvmNative, USDC } from 'sushi/evm'
import { zeroAddress } from 'viem'
import * as z from 'zod'
import {
  type AnyTokenAnyChainDepositChainId,
  isAnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'
import { graphRequest } from '../api-mocks'
import type { NetworkMocks } from '../intercept-anvil'
import {
  type HyperliquidSubscription,
  infoData,
  subscriptionData,
} from './hyperliquid-fixtures'
import { PERPS_ROUTER_ADDRESS } from './wallet'

export const PERPS_DEPOSIT_AMOUNT = '98500000'
export const PERPS_DEPOSIT_MINIMUM = '98000000'
export type PerpsSettlement =
  | 'pending'
  | 'completed'
  | 'partial'
  | 'refunded'
  | 'failed'
  | 'unverified'

const quoteRequestSchema = z.object({
  fromChainId: z.number(),
  fromAmount: z.string().regex(/^[1-9]\d*$/),
  fromTokenAddress: z.string(),
  fromAddress: z.string(),
  toChainId: z.literal(LIFI_PERPS_CHAIN_ID),
  toTokenAddress: z.string(),
  toAddress: z.string(),
  options: z.object({
    order: z.literal('FASTEST'),
    slippage: z.number(),
    integrator: z.literal('sushi'),
    allowSwitchChain: z.literal(false),
    allowDestinationCall: z.literal(true),
    exchanges: z.object({ allow: z.tuple([z.literal('sushiswap')]) }),
    fee: z.number(),
  }),
})
type QuoteRequest = z.infer<typeof quoteRequestSchema>

function routeFor(
  request: QuoteRequest,
  duration: number,
): Omit<LifiPerpsRoute, 'step'> & { steps: LifiPerpsStep[] } {
  if (!isAnyTokenAnyChainDepositChainId(request.fromChainId))
    throw new Error('Unsupported source chain')
  const native = EvmNative.fromChainId(request.fromChainId)
  const stable = Object.values(USDC).find(
    (token) =>
      token.chainId === request.fromChainId &&
      token.address.toLowerCase() === request.fromTokenAddress.toLowerCase(),
  )
  if (request.fromTokenAddress !== zeroAddress && !stable)
    throw new Error('Unrecorded perps source token')
  const fromToken = {
    chainId: request.fromChainId,
    address: stable?.address ?? zeroAddress,
    name: stable?.name ?? native.name,
    symbol: stable?.symbol ?? native.symbol,
    decimals: stable?.decimals ?? native.decimals,
  }
  const toToken = {
    chainId: LIFI_PERPS_CHAIN_ID,
    address: LIFI_PERPS_USDC_ADDRESS,
    name: 'USD Coin (Perps)',
    symbol: 'USDC',
    decimals: 6,
  } as const
  const id = `perps-${request.fromChainId}-${request.fromAmount}-${duration === 1 ? 'fast' : 'slow'}`
  const tool = duration === 1 ? 'layerswap' : 'polymerStandard'
  const step = lifiPerpsStepSchema.parse({
    id: `${id}:0`,
    type: 'lifi',
    tool,
    toolDetails: {
      key: tool,
      name: duration === 1 ? 'Layerswap' : 'Polymer Standard',
      logoURI: 'https://li.fi/logo.svg',
    },
    action: {
      ...request,
      fromToken,
      toToken,
      slippage: request.options.slippage,
    },
    estimate: {
      fromAmount: request.fromAmount,
      toAmount: PERPS_DEPOSIT_AMOUNT,
      toAmountMin: PERPS_DEPOSIT_MINIMUM,
      approvalAddress: PERPS_ROUTER_ADDRESS,
      executionDuration: duration,
      skipApproval: !stable,
    },
    executionType: 'transaction',
    integrator: 'sushi',
    includedSteps: [
      {
        type: 'cross',
        tool,
        action: {
          fromChainId: request.fromChainId,
          toChainId: LIFI_PERPS_CHAIN_ID,
          toToken,
          toAddress: request.toAddress,
          destinationGasConsumption: '0',
        },
      },
    ],
  })
  return {
    id,
    fromChainId: request.fromChainId,
    fromAmount: request.fromAmount,
    fromToken,
    fromAddress: step.action.fromAddress,
    toChainId: LIFI_PERPS_CHAIN_ID,
    toToken,
    toAddress: step.action.toAddress,
    toAmount: PERPS_DEPOSIT_AMOUNT,
    toAmountMin: PERPS_DEPOSIT_MINIMUM,
    containsSwitchChain: false,
    steps: [step],
  }
}

export class PerpsApiMockController {
  readonly quoteRequests: QuoteRequest[] = []
  readonly stepRequests: LifiPerpsStep[] = []
  readonly statusRequests: URL[] = []
  readonly infoRequests: string[] = []
  readonly accountRequests: { accountValue: string; user: string }[] = []
  readonly websocketSubscriptions: string[] = []
  readonly sockets = new Map<
    WebSocketRoute,
    Map<string, HyperliquidSubscription>
  >()
  settlement: PerpsSettlement = 'pending'
  quoteAvailable = true
  private balanceValue = '100'

  constructor(
    readonly sourceChainId: AnyTokenAnyChainDepositChainId,
    readonly sender: EvmAddress,
  ) {}

  get accountValue(): string {
    return this.balanceValue
  }

  setSettlement(settlement: PerpsSettlement): void {
    this.settlement = settlement
    if (settlement === 'completed') this.setAccountValue('198.5')
  }

  setAccountValue(accountValue: string): void {
    this.balanceValue = accountValue
    for (const [socket, subscriptions] of this.sockets) {
      for (const subscription of subscriptions.values()) {
        if (subscription.type === 'allDexsClearinghouseState')
          this.sendSubscription(socket, subscription)
      }
    }
  }

  sendSubscription(
    socket: WebSocketRoute,
    subscription: HyperliquidSubscription,
  ): void {
    socket.send(
      JSON.stringify({
        channel: subscription.type,
        data: subscriptionData(subscription, this.sender, this.accountValue),
      }),
    )
  }

  async respond(request: Request): Promise<Response | undefined> {
    const url = new URL(request.url)
    if (
      url.hostname === 'h20qtjygwppc.statuspage.io' &&
      url.pathname === '/api/v2/status.json' &&
      request.method === 'GET'
    ) {
      return Response.json({
        page: {
          id: 'h20qtjygwppc',
          name: 'Hyperliquid',
          url: 'https://status.hyperliquid.xyz',
          time_zone: 'Etc/UTC',
          updated_at: '2026-11-16T00:00:00.000Z',
        },
        status: { indicator: 'none', description: 'All Systems Operational' },
      })
    }
    if (url.hostname === 'api.hyperliquid.xyz' && url.pathname === '/info') {
      const input = z
        .object({ type: z.string() })
        .passthrough()
        .parse(await request.json())
      this.infoRequests.push(input.type)
      if (input.type === 'clearinghouseState')
        this.accountRequests.push({
          accountValue: this.accountValue,
          user: this.sender,
        })
      return Response.json(infoData(input.type, this.sender, this.accountValue))
    }
    if (url.hostname === 'li.quest' && url.pathname === '/v1/advanced/routes') {
      const input = quoteRequestSchema.parse(await request.json())
      if (
        input.fromChainId !== this.sourceChainId ||
        input.fromAddress.toLowerCase() !== this.sender.toLowerCase() ||
        input.toAddress.toLowerCase() !== this.sender.toLowerCase() ||
        input.toTokenAddress.toLowerCase() !==
          LIFI_PERPS_USDC_ADDRESS.toLowerCase()
      )
        throw new Error('Unrecorded perps quote recipient or source')
      this.quoteRequests.push(input)
      return Response.json({
        routes: this.quoteAvailable
          ? [routeFor(input, 1080), routeFor(input, 1)]
          : [],
      })
    }
    if (
      url.hostname === 'li.quest' &&
      url.pathname === '/v1/advanced/stepTransaction'
    ) {
      const step = lifiPerpsStepSchema.parse(await request.json())
      if (
        !this.quoteRequests.some(
          (quote) => routeFor(quote, 1).steps[0].id === step.id,
        )
      )
        throw new Error('Preparation must use the selected fastest quote')
      this.stepRequests.push(step)
      const prepared: LifiPerpsPreparedStep = {
        ...step,
        transactionRequest: {
          chainId: this.sourceChainId,
          from: this.sender,
          to: PERPS_ROUTER_ADDRESS,
          data: '0x12345678',
          value:
            step.action.fromToken.address === zeroAddress
              ? step.action.fromAmount
              : '0',
          gasPrice: '1000000000',
          gasLimit: '100000',
        },
      }
      return Response.json(prepared)
    }
    if (url.hostname === 'li.quest' && url.pathname === '/v1/status') {
      if (
        url.searchParams.get('fromChain') !== String(this.sourceChainId) ||
        url.searchParams.get('toChain') !== String(LIFI_PERPS_CHAIN_ID) ||
        !/^0x[a-f0-9]{64}$/i.test(url.searchParams.get('txHash') ?? '')
      )
        throw new Error('Unexpected deposit status request')
      this.statusRequests.push(url)
      if (this.settlement === 'pending')
        return Response.json({ status: 'PENDING' })
      return Response.json({
        status: this.settlement === 'failed' ? 'FAILED' : 'DONE',
        substatus:
          this.settlement === 'completed' || this.settlement === 'unverified'
            ? 'COMPLETED'
            : this.settlement.toUpperCase(),
        toAddress: this.sender,
        receiving: {
          chainId:
            this.settlement === 'unverified' ? 42161 : LIFI_PERPS_CHAIN_ID,
          amount: PERPS_DEPOSIT_AMOUNT,
          txHash: url.searchParams.get('txHash'),
          token: {
            chainId: LIFI_PERPS_CHAIN_ID,
            address:
              this.settlement === 'partial'
                ? zeroAddress
                : LIFI_PERPS_USDC_ADDRESS,
            symbol: 'USDC',
            decimals: 6,
          },
        },
        lifiExplorerLink: `https://scan.li.fi/tx/${url.searchParams.get('txHash')}`,
      })
    }
    const priceChain = /^\/price\/v1\/(\d+)$/.exec(url.pathname)
    if (priceChain && isAnyTokenAnyChainDepositChainId(Number(priceChain[1]))) {
      return request.headers.get('accept') === 'application/octet-stream'
        ? new Response(new Uint8Array(), {
            headers: {
              'Content-Type': 'application/octet-stream',
              'Last-Updated': '0',
            },
          })
        : Response.json({})
    }
    if (url.pathname === '/api/graphql') {
      const { operationName, variables } = graphRequest.parse(
        await request.json(),
      )
      if (operationName === 'PerpsSushiReferralOverview') {
        return Response.json({
          data: {
            perps: {
              referralOverview: {
                address: this.sender,
                primaryReferralCode: null,
                activeFeeLevels: [],
                hasRedeemedReferralCode: false,
                referredUserCount: 0,
                totalEarnedFees: 0,
              },
            },
          },
        })
      }
      if (operationName === 'PerpsPointsOverview') {
        return Response.json({
          data: {
            perps: {
              pointsOverview: {
                address: this.sender,
                pointMultipliers: [],
                baseMultiplier: 1,
                totalVolumeUsd: 0,
                totalPoints: 0,
                points7d: 0,
                points30d: 0,
              },
            },
          },
        })
      }
      if (
        operationName === 'TokenListBalances' ||
        operationName === 'TokenList'
      ) {
        const chainId = Number(variables.chainId)
        if (!isAnyTokenAnyChainDepositChainId(chainId)) return undefined
        const native = EvmNative.fromChainId(chainId)
        const stable = Object.values(USDC).find(
          (token) => token.chainId === chainId,
        )
        const nativeToken = {
          address: NativeAddress,
          name: native.name,
          symbol: native.symbol,
          decimals: native.decimals,
          approved: true,
          approvalStatus: 'APPROVED',
          balance: (10n ** 19n).toString(),
        }
        const stableTokens = stable
          ? [
              {
                address: stable.address,
                name: stable.name,
                symbol: stable.symbol,
                decimals: stable.decimals,
                approved: true,
                approvalStatus: 'APPROVED',
                balance: (1000n * 10n ** BigInt(stable.decimals)).toString(),
              },
            ]
          : []
        const tokens =
          operationName === 'TokenListBalances' && variables.includeNative
            ? [nativeToken, ...stableTokens]
            : stableTokens
        return Response.json({
          data: {
            [operationName === 'TokenListBalances'
              ? 'tokenListBalances'
              : 'tokenList']: tokens,
          },
        })
      }
    }
    return undefined
  }
}

export function installPerpsApiMocks(
  mocks: NetworkMocks,
  sourceChainId: AnyTokenAnyChainDepositChainId,
  sender: EvmAddress,
): PerpsApiMockController {
  const controller = new PerpsApiMockController(sourceChainId, sender)
  mocks.add((request) => controller.respond(request))
  return controller
}

export async function installPerpsWebSocketMocks(
  page: Page,
  controller: PerpsApiMockController,
): Promise<void> {
  await page.routeWebSocket('wss://api.hyperliquid.xyz/ws', (socket) => {
    const subscriptions = new Map<string, HyperliquidSubscription>()
    controller.sockets.set(socket, subscriptions)
    socket.onMessage((message) => {
      const input = z
        .object({
          method: z.string(),
          id: z.number().optional(),
          request: z
            .object({
              type: z.literal('info'),
              payload: z.object({ type: z.string() }).passthrough(),
            })
            .optional(),
          subscription: z
            .object({
              type: z.string(),
              user: z.string().optional(),
              coin: z.string().optional(),
              interval: z.string().optional(),
            })
            .passthrough()
            .optional(),
        })
        .parse(JSON.parse(message.toString()))
      if (input.method === 'ping') {
        socket.send(JSON.stringify({ channel: 'pong' }))
        return
      }
      if (input.method === 'post' && input.request && input.id !== undefined) {
        const type = input.request.payload.type
        controller.infoRequests.push(type)
        socket.send(
          JSON.stringify({
            channel: 'post',
            data: {
              id: input.id,
              response: {
                type: 'info',
                payload: {
                  type,
                  data: infoData(
                    type,
                    controller.sender,
                    controller.accountValue,
                  ),
                },
              },
            },
          }),
        )
        return
      }
      if (
        !input.subscription ||
        !['subscribe', 'unsubscribe'].includes(input.method)
      )
        throw new Error(`Unexpected Hyperliquid WS method ${input.method}`)
      const key = JSON.stringify(input.subscription)
      socket.send(
        JSON.stringify({
          channel: 'subscriptionResponse',
          data: { method: input.method, subscription: input.subscription },
        }),
      )
      if (input.method === 'unsubscribe') {
        subscriptions.delete(key)
        return
      }
      subscriptions.set(key, input.subscription)
      controller.websocketSubscriptions.push(input.subscription.type)
      controller.sendSubscription(socket, input.subscription)
    })
    socket.onClose(() => controller.sockets.delete(socket))
  })
}
