import { Card } from '@sushiswap/ui'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
export const UnconnectedState = () => {
  return (
    <Card>
      <div className="px-6 py-8 flex justify-center flex-col items-center gap-4 text-muted-foreground">
        <p>Connect wallet to track your points and ranks.</p>
        <ConnectButton />
      </div>
    </Card>
  )
}
