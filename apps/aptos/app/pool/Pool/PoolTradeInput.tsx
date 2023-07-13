import { useWallet } from '@aptstats/aptos-wallet-framework'
import TradeInput from 'components/TradeInput'
import { useRef } from 'react'

interface Props {
  isLoading: boolean
}

export const PoolTradeInput = ({}: Props) => {
  const { connected } = useWallet()
  const tradeVal = useRef<HTMLInputElement>(null)
  const checkBalance = (value:string) => {
    
  }
  return (
   
  )
}
