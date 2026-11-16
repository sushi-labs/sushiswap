import type {
  ClearinghouseStateResponse,
  MetaResponse,
  SpotMetaResponse,
  UserFeesResponse,
} from '@nktkas/hyperliquid/api/info'
import type { EvmAddress } from 'sushi/evm'

export const PERPS_MOCK_TIME = 1_800_000_000_000

export const spotMeta = {
  tokens: [
    {
      name: 'USDC',
      szDecimals: 2,
      weiDecimals: 8,
      index: 0,
      tokenId: '0x6d1e7cde53ba9467b783cb7c530ce054',
      isCanonical: true,
      evmContract: null,
      fullName: 'USD Coin',
      deployerTradingFeeShare: '0',
    },
  ],
  universe: [],
} satisfies SpotMetaResponse

export const perpMeta = {
  universe: [
    { name: 'BTC', szDecimals: 5, maxLeverage: 40, marginTableId: 56 },
  ],
  marginTables: [
    [
      56,
      {
        description: 'BTC',
        marginTiers: [{ lowerBound: '0', maxLeverage: 40 }],
      },
    ],
  ],
  collateralToken: 0,
} satisfies MetaResponse

export const assetContext = {
  funding: '0.00001',
  openInterest: '100',
  prevDayPx: '99000',
  dayNtlVlm: '1000000',
  premium: '0',
  oraclePx: '100000',
  markPx: '100000',
  midPx: '100000',
  impactPxs: ['99999', '100001'],
  dayBaseVlm: '10',
}

const userFees = {
  dailyUserVlm: [],
  feeSchedule: {
    cross: '0.00045',
    add: '0.00015',
    spotCross: '0.0007',
    spotAdd: '0.0004',
    tiers: { vip: [], mm: [] },
    referralDiscount: '0',
    stakingDiscountTiers: [],
  },
  userCrossRate: '0.00045',
  userAddRate: '0.00015',
  userSpotCrossRate: '0.0007',
  userSpotAddRate: '0.0004',
  activeReferralDiscount: '0',
  trial: null,
  feeTrialEscrow: '0',
  nextTrialAvailableTimestamp: null,
  stakingLink: null,
  activeStakingDiscount: { bpsOfMaxSupply: '0', discount: '0' },
} satisfies UserFeesResponse

export function clearinghouseState(
  accountValue: string,
): ClearinghouseStateResponse {
  const marginSummary = {
    accountValue,
    totalNtlPos: '0',
    totalRawUsd: accountValue,
    totalMarginUsed: '0',
  }
  return {
    marginSummary,
    crossMarginSummary: marginSummary,
    crossMaintenanceMarginUsed: '0',
    withdrawable: accountValue,
    assetPositions: [],
    time: PERPS_MOCK_TIME,
  }
}

export interface HyperliquidSubscription {
  type: string
  user?: string
  coin?: string
  interval?: string
}

export function subscriptionData(
  subscription: HyperliquidSubscription,
  sender: EvmAddress,
  accountValue: string,
): unknown {
  const user = subscription.user ?? sender
  const coin = subscription.coin ?? 'BTC'
  switch (subscription.type) {
    case 'webData3':
      return {
        userState: {
          user,
          agentAddress: null,
          agentValidUntil: null,
          cumLedger: '100',
          serverTime: PERPS_MOCK_TIME,
          isVault: false,
          abstraction: 'disabled',
        },
        perpDexStates: [
          {
            totalVaultEquity: '0',
            leadingVaults: [],
            perpsAtOpenInterestCap: [],
          },
        ],
      }
    case 'allDexsClearinghouseState':
      return {
        user,
        clearinghouseStates: [['', clearinghouseState(accountValue)]],
      }
    case 'spotState':
      return { user, spotState: { balances: [] } }
    case 'allDexsAssetCtxs':
      return { ctxs: [['', [assetContext]]] }
    case 'spotAssetCtxs':
      return []
    case 'activeAssetCtx':
      return { coin, ctx: assetContext }
    case 'activeAssetData':
      return {
        user,
        coin,
        leverage: { type: 'cross', value: 1 },
        maxTradeSzs: ['0', '0'],
        availableToTrade: [accountValue, accountValue],
        markPx: '100000',
      }
    case 'allMids':
      return { mids: { BTC: '100000' } }
    case 'l2Book':
      return {
        coin,
        time: PERPS_MOCK_TIME,
        levels: [
          [{ px: '99999', sz: '1', n: 1 }],
          [{ px: '100001', sz: '1', n: 1 }],
        ],
      }
    case 'trades':
      return []
    case 'candle':
      return {
        t: PERPS_MOCK_TIME,
        T: PERPS_MOCK_TIME + 60_000,
        s: coin,
        i: subscription.interval ?? '1m',
        o: '100000',
        c: '100000',
        h: '100001',
        l: '99999',
        v: '10',
        n: 1,
      }
    case 'openOrders':
      return { user, orders: [] }
    case 'userFills':
      return { user, fills: [], isSnapshot: true }
    case 'userFundings':
      return { user, fundings: [], isSnapshot: true }
    case 'userHistoricalOrders':
      return { user, orderHistory: [], isSnapshot: true }
    case 'userTwapHistory':
      return { user, history: [], isSnapshot: true }
    case 'userTwapSliceFills':
      return { user, twapSliceFills: [], isSnapshot: true }
    case 'twapStates':
      return { user, states: [] }
    case 'notification':
      return { notification: '' }
    default:
      throw new Error(`Unmocked Hyperliquid subscription: ${subscription.type}`)
  }
}

export function infoData(
  type: string,
  sender: EvmAddress,
  accountValue: string,
): unknown {
  switch (type) {
    case 'legalCheck':
      return { acceptedTerms: true, userAllowed: true, restrictions: 'n' }
    case 'spotMeta':
      return spotMeta
    case 'outcomeMeta':
      return { outcomes: [], questions: [] }
    case 'meta':
      return perpMeta
    case 'marginTable':
      return perpMeta.marginTables[0][1]
    case 'allPerpMetas':
      return [perpMeta]
    case 'perpDexs':
      return [null]
    case 'metaAndAssetCtxs':
      return [perpMeta, [assetContext]]
    case 'spotMetaAndAssetCtxs':
      return [spotMeta, []]
    case 'perpCategories':
      return [['BTC', 'Crypto']]
    case 'clearinghouseState':
      return clearinghouseState(accountValue)
    case 'spotClearinghouseState':
      return { balances: [] }
    case 'userAbstraction':
      return 'disabled'
    case 'userRole':
      return { role: 'user' }
    case 'maxBuilderFee':
      return 60
    case 'userFees':
      return userFees
    case 'borrowLendUserState':
      return { tokenToState: [], health: 'healthy', healthFactor: null }
    case 'delegatorSummary':
      return {
        delegated: '0',
        undelegated: '0',
        totalPendingWithdrawal: '0',
        nPendingWithdrawals: 0,
      }
    case 'referral':
      return {
        referredBy: null,
        cumVlm: '0',
        unclaimedRewards: '0',
        claimedRewards: '0',
        builderRewards: '0',
        tokenToState: [],
      }
    case 'activeAssetData':
      return subscriptionData(
        { type: 'activeAssetData', user: sender },
        sender,
        accountValue,
      )
    case 'allMids':
      return { BTC: '100000' }
    case 'subAccounts':
    case 'subAccounts2':
    case 'extraAgents':
    case 'approvedBuilders':
    case 'userVaultEquities':
    case 'leadingVaults':
    case 'userNonFundingLedgerUpdates':
    case 'userBorrowLendInterest':
    case 'portfolio':
    case 'userTwapHistory':
    case 'userTwapSliceFills':
    case 'userFills':
    case 'historicalOrders':
    case 'openOrders':
    case 'frontendOpenOrders':
    case 'fundingHistory':
    case 'candleSnapshot':
    case 'perpsAtOpenInterestCap':
      return []
    default:
      throw new Error(`Unmocked Hyperliquid info request: ${type}`)
  }
}
