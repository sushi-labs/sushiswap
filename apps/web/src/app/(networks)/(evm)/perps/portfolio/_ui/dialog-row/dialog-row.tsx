import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@sushiswap/ui'
import {
  DepositDialog,
  PerpSpotTransferDialog,
  SendDialog,
  WithdrawDialog,
} from '~evm/perps/_ui/account-management'

export const DialogRow = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <PerpSpotTransferDialog
        trigger={
          <Button variant="perps-secondary">
            Perps
            <ArrowsUpDownIcon className="w-3 h-3 rotate-90" /> Spot
          </Button>
        }
      />
      <SendDialog trigger={<Button variant="perps-secondary">Send</Button>} />
      <WithdrawDialog
        trigger={<Button variant="perps-secondary">Withdraw</Button>}
      />
      <DepositDialog
        trigger={<Button variant="perps-default">Deposit</Button>}
      />
    </div>
  )
}
