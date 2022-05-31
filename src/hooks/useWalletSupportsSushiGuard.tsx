import useIsCoinbaseWallet from './useIsCoinbaseWallet'

export default function useWalletSupportsSushiGuard() {
  const isCoinbaseWallet = useIsCoinbaseWallet()
  if (isCoinbaseWallet) return false
  return true
}
