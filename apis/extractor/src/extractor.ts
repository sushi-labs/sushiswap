import {
  Extractor,
  // type WarningLevel
} from '@sushiswap/extractor'

import {
  type RouteProcessor3ChainId,
  type RouteProcessor3_1ChainId,
  type RouteProcessor3_2ChainId,
} from 'sushi/config'

const extractors = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  Extractor
>()

export default extractors
