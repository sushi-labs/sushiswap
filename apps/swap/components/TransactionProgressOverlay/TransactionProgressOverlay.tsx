import { ChainId } from '@sushiswap/chain'
import { STARGATE_CONFIRMATION_SECONDS } from '@sushiswap/stargate'
import { Button, Typography } from '@sushiswap/ui'

import { TransactionProgressStepper } from './TransactionProgressStepper'

export const TransactionProgressOverlay = () => {
  return (
    <div className="flex flex-col gap-4 flex-grow">
      <Typography variant="xs" className="text-slate-500 pt-4 text-center">
        This usually takes{' '}
        <span className="font-bold text-slate-200">
          {/*TODO*/}~{Math.ceil(STARGATE_CONFIRMATION_SECONDS[ChainId.ETHEREUM] / 60)} minutes
        </span>{' '}
        but <br /> sometimes the wait is longer.
      </Typography>
      <div className="flex justify-center items-center flex-grow">
        <TransactionProgressStepper />
      </div>
      <Button fullWidth color="gradient">
        Make Another Swap
      </Button>
    </div>
  )
}
