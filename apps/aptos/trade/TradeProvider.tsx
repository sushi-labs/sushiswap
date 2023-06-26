// 'use client'

// import { useContext, useMemo } from "react"
// import { createContext } from "vm"

// interface InternalSwapState {
//     isFallback: boolean
//     tradeId: string
//     review: boolean
//     value: string
// }

// interface SwapState {
//     token0: Type | undefined
//     token1: Type | undefined
//     network0: SwapChainId
//     network1: SwapChainId
//     amount: Amount<Type> | undefined
//     appType: AppType
//     tokensLoading: boolean
//     recipient: string | undefined
// }

// type State = InternalSwapState & SwapState

// type SwapApi = {
//     setReview(value: boolean): void
//     setRecipient(recipient: string): void
//     setNetworks(chainId: SwapChainId): void
//     setNetwork0(chainId: SwapChainId): void
//     setNetwork1(chainId: SwapChainId): void
//     setToken0(currency: Type): void
//     setToken1(currency: Type): void
//     setValue(value: string): void
//     switchTokens(): void
//     setTokens(currency0: Type, currency1: Type): void
//     setAppType(appType: AppType): void
//     setSearch(currency: Type): void
//     setTradeId(id: string): void
//     setFallback(val: boolean): void
// }

// export const SwapStateContext = createContext<State>({} as State)
// export const SwapActionsContext = createContext<SwapApi>({} as SwapApi)

// type Actions =
//     | { type: 'setTradeId'; value: string }
//     | { type: 'setValue'; value: string }
//     | { type: 'setReview'; value: boolean }
//     | { type: 'setFallback'; value: boolean }

// const reducer = (state: InternalSwapState, action: Actions): InternalSwapState => {
//     switch (action.type) {
//         case 'setTradeId':
//             return { ...state, tradeId: action.value }
//         case 'setReview':
//             return { ...state, review: action.value }
//         case 'setValue':
//             return {
//                 ...state,
//                 value: action.value,
//             }
//         case 'setFallback':
//             return {
//                 ...state,
//                 isFallback: action.value,
//             }
//     }
// }

// interface SwapProviderProps {
//     children: ReactNode
// }

// export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
//     const { address } = useAccount()
//     // const { query, push, pathname } = useRouter()

//     const searchParams = useSearchParams()!
//     const pathname = usePathname()
//     const { push } = useRouter()

//     // const _fromChainId = searchParams?.get('fromChainId')
//     const _fromCurrency = searchParams?.get('fromCurrency')
//     // const _toChainId = searchParams?.get('toChainId')
//     const _toCurrency = searchParams?.get('toCurrency')
//     const _amount = searchParams?.get('amount')
//     const _recipient = searchParams?.get('recipient')
//     const _review = searchParams?.get('review')

//     const { fromCurrency, toCurrency, amount, recipient, review } = queryParamsSchema.parse({
//         fromCurrency: _fromCurrency,
//         toCurrency: _toCurrency,
//         amount: _amount,
//         recipient: _recipient,
//         review: _review,
//     })
//     const { token0, token1, fromChainId, toChainId } = useTokenState()

//     const [internalState, dispatch] = useReducer(reducer, {
//         isFallback: true,
//         tradeId: nanoid(),
//         review: review ? review : false,
//         value: !amount || amount === '0' ? '' : amount,
//     })

//     // console.log({ token0, token1 })

//     const state = useMemo(() => {
//         return {
//             ...internalState,
//             appType: fromChainId === toChainId ? AppType.Swap : AppType.xSwap,
//             token0,
//             token1,
//             network0: fromChainId,
//             network1: toChainId,
//             amount: tryParseAmount(internalState.value ? internalState.value.toString() : undefined, token0),
//             tokensLoading: false,
//         }
//     }, [fromChainId, internalState, toChainId, token0, token1])

//     const api = useMemo(() => {
//         const setNetworks = (chainId: SwapChainId) => {
//             const token0 = state.token0?.chainId === chainId ? state.token0 : Native.onChain(chainId)
//             const token1 =
//                 state.token1?.chainId === chainId
//                     ? state.token1.isNative
//                         ? 'NATIVE'
//                         : state.token1.wrapped.address
//                     : defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].address
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', chainId.toString())
//             _searchParams.set('fromCurrency', token0.isNative ? 'NATIVE' : token0.wrapped.address)
//             _searchParams.set('toChainId', chainId.toString())
//             _searchParams.set('toCurrency', token1)
//             _searchParams.set('amount', '')
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }

//         const setNetwork0 = (chainId: SwapChainId) => {
//             const fromCurrency =
//                 state.token0?.chainId === chainId ? (state.token0.isNative ? 'NATIVE' : state.token0.wrapped.address) : 'NATIVE'
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', chainId.toString())
//             _searchParams.set('fromCurrency', fromCurrency)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setNetwork1 = (chainId: SwapChainId) => {
//             const toCurrency =
//                 state.token1?.chainId === chainId
//                     ? state.token1.isNative
//                         ? 'NATIVE'
//                         : state.token1.wrapped.address
//                     : defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].address
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('toChainId', chainId.toString())
//             _searchParams.set('toCurrency', toCurrency)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setTokens = (currency0: Type, currency1: Type) => {
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', currency0.chainId.toString())
//             _searchParams.set('fromCurrency', currency0.isNative ? 'NATIVE' : currency0.wrapped.address)
//             _searchParams.set('toChainId', currency1.chainId.toString())
//             _searchParams.set('toCurrency', currency1.isNative ? 'NATIVE' : currency1.wrapped.address)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setToken0 = (currency: Type) => {
//             const _fromCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', currency.chainId.toString())
//             _searchParams.set('fromCurrency', _fromCurrency)
//             _searchParams.set(
//                 'toChainId',
//                 toCurrency === _fromCurrency && toChainId === fromChainId ? fromChainId.toString() : toChainId.toString()
//             )
//             _searchParams.set(
//                 'toCurrency',
//                 toCurrency === _fromCurrency && toChainId === fromChainId ? fromCurrency : toCurrency
//             )
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setToken1 = (currency: Type) => {
//             const _toCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set(
//                 'fromChainId',
//                 fromCurrency === _toCurrency && toChainId === fromChainId ? toChainId.toString() : fromChainId.toString()
//             )
//             _searchParams.set(
//                 'fromCurrency',
//                 fromCurrency === _toCurrency && toChainId === fromChainId ? toCurrency : fromCurrency
//             )
//             _searchParams.set('toChainId', currency.chainId.toString())
//             _searchParams.set('toCurrency', _toCurrency)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const switchTokens = () => {
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', toChainId.toString())
//             _searchParams.set('fromCurrency', toCurrency)
//             _searchParams.set('toChainId', fromChainId.toString())
//             _searchParams.set('toCurrency', fromCurrency)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setAppType = (appType: AppType) => {
//             const network1 =
//                 appType === AppType.Swap
//                     ? state.network0
//                     : state.network1 === state.network0
//                         ? state.network1 === ChainId.ARBITRUM
//                             ? ChainId.ETHEREUM
//                             : ChainId.ARBITRUM
//                         : state.network1
//             const token1 =
//                 state.token1?.chainId === network1
//                     ? state.token1.isNative
//                         ? 'NATIVE'
//                         : state.token1.wrapped.address
//                     : state.token0?.symbol === defaultQuoteCurrency[network1 as keyof typeof defaultQuoteCurrency].symbol
//                         ? 'NATIVE'
//                         : defaultQuoteCurrency[network1 as keyof typeof defaultQuoteCurrency].address
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('toChainId', network1.toString())
//             _searchParams.set('toCurrency', token1)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }
//         const setSearch = (currency: Type) => {
//             const _searchParams = new URLSearchParams(searchParams)
//             _searchParams.set('fromChainId', currency.chainId.toString())
//             _searchParams.set('fromCurrency', 'NATIVE')
//             _searchParams.set('toChainId', currency.chainId.toString())
//             _searchParams.set('toCurrency', currency.isNative ? 'NATIVE' : currency.wrapped.address)
//             void push(`${pathname}?${_searchParams.toString()}`)
//         }

//         const setValue = (value: string) => {
//             if (value !== _amount) {
//                 const _searchParams = new URLSearchParams(searchParams)
//                 _searchParams.set('amount', value)
//                 void push(`${pathname}?${_searchParams.toString()}`)
//             }
//             dispatch({ type: 'setValue', value })
//         }
//         const setRecipient = (recipient: string) => {
//             if (recipient !== _recipient) {
//                 const _searchParams = new URLSearchParams(searchParams)
//                 _searchParams.set('recipient', recipient)
//                 void push(`${pathname}?${_searchParams.toString()}`)
//             }
//         }
//         const setReview = (value: boolean) => dispatch({ type: 'setReview', value })
//         const setTradeId = (value: string) => dispatch({ type: 'setTradeId', value })
//         const setFallback = (value: boolean) => dispatch({ type: 'setFallback', value })

//         return {
//             setTradeId,
//             setNetworks,
//             setNetwork0,
//             setNetwork1,
//             setToken0,
//             setToken1,
//             setValue,
//             switchTokens,
//             setRecipient,
//             setReview,
//             setTokens,
//             setAppType,
//             setSearch,
//             setFallback,
//         }
//     }, [
//         _recipient,
//         _amount,
//         fromChainId,
//         fromCurrency,
//         pathname,
//         push,
//         searchParams,
//         state.network0,
//         state.network1,
//         state.token0,
//         state.token1,
//         toChainId,
//         toCurrency,
//     ])

//     return (
//         <SwapActionsContext.Provider value={api}>
//             <SwapStateContext.Provider
//                 value={useMemo(() => ({ ...state, recipient: recipient ?? address }), [address, recipient, state])}
//             >
//                 {children}
//             </SwapStateContext.Provider>
//         </SwapActionsContext.Provider>
//     )
// }

// export const useSwapState = () => {
//     const context = useContext(SwapStateContext)
//     if (!context) {
//         throw new Error('Hook can only be used inside State Context')
//     }
//     return context
// }

// export const useSwapActions = () => {
//     const context = useContext(SwapActionsContext)
//     if (!context) {
//         throw new Error('Hook can only be used inside State Actions Context')
//     }

//     return context
// }
