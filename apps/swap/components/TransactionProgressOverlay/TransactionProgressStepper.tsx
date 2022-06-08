import chain, { ChainId } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui'

import { TransactionProgressStep } from './TransactionProgressStep'

export const TransactionProgressStepper = () => {
  return (
    <div className="flex flex-col">
      <TransactionProgressStep
        status="success"
        header={
          <TransactionProgressStep.Header>
            Swapping <b>2.60043 ETH</b> for <b>USDC</b>
          </TransactionProgressStep.Header>
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<NetworkIcon chainId={ChainId.ETHEREUM} width={14} height={14} />}
            caption={chain[ChainId.ETHEREUM].name}
          />
        }
        txHash=""
      />
      <TransactionProgressStep
        status="pending"
        header={
          <TransactionProgressStep.Header>
            Send <b>USDC</b> to destination chain
          </TransactionProgressStep.Header>
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<NetworkIcon chainId={ChainId.ETHEREUM} width={14} height={14} />}
            caption="Powered by Stargate"
          />
        }
        txHash=""
      />
      <TransactionProgressStep
        lastStep={true}
        status="failed"
        header={
          <TransactionProgressStep.Header>
            Swap <b>USDC</b> for <b>20.12 SUSHI</b>
          </TransactionProgressStep.Header>
        }
        subheader={
          <TransactionProgressStep.SubHeader
            icon={<NetworkIcon chainId={ChainId.POLYGON} width={14} height={14} />}
            caption={chain[ChainId.POLYGON].name}
          />
        }
        txHash=""
      />
    </div>
  )
}
