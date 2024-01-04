import { NativeWrapProvider } from '@sushiswap/router'
import {
  type RouteProcessor3ChainId,
  type RouteProcessor3_1ChainId,
  type RouteProcessor3_2ChainId,
} from 'sushi/config'

export const nativeProviders = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  NativeWrapProvider
>()
