import { Price, Token } from '@sushiswap/core-sdk'
import { ILimitOrderData, LimitOrder, OrderStatus } from '@sushiswap/limit-order-sdk'

export interface LimitOrdersResponse {
  pendingOrders: PendingOrders
  otherOrders: OtherOrders
}

export interface OtherOrders {
  orders: Order[]
  maxPage: number
  totalOrders: number
}

export interface PendingOrders {
  orders: Order[]
  filledAmounts: string[]
  pendingOrderMaxPage: number
  totalPendingOrders: number
}

export interface Order extends ILimitOrderData {
  _id: string
  amountIn: string
  filledAmount?: string
  status: OrderStatus
}

export interface DerivedOrder {
  id: string
  tokenIn: Token
  tokenOut: Token
  filledPercent: string
  limitOrder: LimitOrder
  status: OrderStatus
  rate: Price<Token, Token>
}
