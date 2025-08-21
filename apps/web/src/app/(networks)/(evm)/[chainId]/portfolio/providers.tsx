import { SendTokensProvider } from 'src/ui/portfolio/wallet-holdings/send-token-provider'

export const Providers = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return <SendTokensProvider>{children}</SendTokensProvider>
}
