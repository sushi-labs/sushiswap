import { CurrencyAmount, Percent, Price, Token } from '@sushiswap/core-sdk'
import { LAMBDA_URL, LimitOrder, OrderStatus } from '@sushiswap/limit-order-sdk'
import { DerivedOrder, LimitOrdersResponse, Order } from 'app/features/legacy/limit-order/types'
import { useLimitOrderContract } from 'app/hooks'
import { useAllTokens } from 'app/hooks/Tokens'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRResponse } from 'swr'

interface State {
  pending: {
    page: number
    maxPages: number
    data: DerivedOrder[]
    loading: boolean
    totalOrders: number
  }
  completed: {
    page: number
    maxPages: number
    data: DerivedOrder[]
    loading: boolean
    totalOrders: number
  }
}

const viewUrl = `${LAMBDA_URL}/orders/view`
const viewFetcher = (url: string, account: string, chainId: number, pendingPage: number, page: number) => {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ address: account, chainId, page, pendingPage }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((r) => r.json())
    .then((j) => j.data)
}

const useLimitOrders = () => {
  const { account, chainId } = useActiveWeb3React()
  const limitOrderContract = useLimitOrderContract()
  const tokens = useAllTokens()

  const [state, setState] = useState<State>({
    pending: {
      page: 1,
      maxPages: 0,
      data: [],
      loading: true,
      totalOrders: 0,
    },
    completed: {
      page: 1,
      maxPages: 0,
      data: [],
      loading: true,
      totalOrders: 0,
    },
  })

  const shouldFetch = useMemo(
    () =>
      viewUrl && account && chainId ? [viewUrl, account, chainId, state.pending.page, state.completed.page] : null,
    [account, chainId, state.completed.page, state.pending.page]
  )

  const { data: ordersData, mutate }: SWRResponse<LimitOrdersResponse, Error> = useSWR(shouldFetch, viewFetcher)
  const setPendingPage = useCallback((page: number) => {
    setState((prevState) => ({
      ...prevState,
      pending: {
        ...prevState.pending,
        page,
        loading: true,
      },
    }))
  }, [])

  const setCompletedPage = useCallback((page: number) => {
    setState((prevState) => ({
      ...prevState,
      completed: {
        ...prevState.completed,
        page,
        loading: true,
      },
    }))
  }, [])

  useEffect(() => {
    if (
      !account ||
      !chainId ||
      !ordersData ||
      !ordersData.pendingOrders ||
      !ordersData.otherOrders ||
      !Array.isArray(ordersData.pendingOrders.orders) ||
      !Array.isArray(ordersData.otherOrders.orders)
    )
      return

    const transform = async (order: Order) => {
      const limitOrder = LimitOrder.getLimitOrder({
        ...order,
        stopPrice: '0',
        chainId: +order.chainId,
        tokenInDecimals: +order.tokenInDecimals,
        tokenOutDecimals: +order.tokenOutDecimals,
      })

      const tokenIn = limitOrder.amountIn.currency
      const tokenOut = limitOrder.amountOut.currency
      const filledAmount = order.filledAmount ? CurrencyAmount.fromRawAmount(tokenIn, order.filledAmount) : undefined

      const openOrder: DerivedOrder = {
        id: order._id,
        tokenIn:
          tokens[tokenIn.address] ||
          new Token(chainId, tokenIn.address.toLowerCase(), tokenIn.decimals, tokenIn.symbol),
        tokenOut:
          tokens[tokenOut.address] ||
          new Token(chainId, tokenOut.address.toLowerCase(), tokenOut.decimals, tokenOut.symbol),
        limitOrder,
        filledPercent:
          order.status === OrderStatus.FILLED
            ? '100'
            : filledAmount
            ? new Percent(filledAmount.quotient, limitOrder.amountIn.quotient).toSignificant(2)
            : '0.00',
        status: order.status,
        rate: new Price({ baseAmount: limitOrder.amountIn, quoteAmount: limitOrder.amountOut }),
      }

      return openOrder
    }

    const init = async () => {
      const openOrders = await Promise.all<DerivedOrder>(
        // @ts-ignore TYPE NEEDS FIXING
        ordersData.pendingOrders.orders.map((el, i) =>
          transform({ ...el, filledAmount: ordersData.pendingOrders.filledAmounts[i] })
        )
      )
      // @ts-ignore TYPE NEEDS FIXING
      const completedOrders = await Promise.all<OpenOrder>(ordersData.otherOrders.orders.map((el) => transform(el)))

      setState((prevState) => ({
        pending: {
          ...prevState.pending,
          data: openOrders,
          maxPages: ordersData.pendingOrders.pendingOrderMaxPage,
          loading: false,
          totalOrders: ordersData.pendingOrders.totalPendingOrders,
        },
        completed: {
          ...prevState.completed,
          data: completedOrders,
          maxPages: ordersData.otherOrders.maxPage,
          loading: false,
          totalOrders: ordersData.otherOrders.totalOrders,
        },
      }))
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, ordersData, limitOrderContract, setPendingPage, setCompletedPage])

  return useMemo(
    () => ({
      ...state,
      pending: {
        ...state.pending,
        setPage: setPendingPage,
      },
      completed: {
        ...state.completed,
        setPage: setCompletedPage,
      },
      mutate,
    }),
    [mutate, setCompletedPage, setPendingPage, state]
  )
}

export default useLimitOrders
