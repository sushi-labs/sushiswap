import { usePathname } from 'next/navigation'

export const useTradeMode = (): {
  tradeMode: 'swap' | 'limit' | 'dca' | 'fiat'
} => {
  const pathname = usePathname()
  const tradeMode = pathname.split('/')?.[2] as
    | 'swap'
    | 'limit'
    | 'dca'
    | 'fiat'

  return { tradeMode }
}
