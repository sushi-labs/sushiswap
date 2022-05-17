import { isAddress } from '@ethersproject/address'
import { Input } from '@sushiswap/ui'
import Button from '@sushiswap/ui/button/Button'
import { Dialog } from '@sushiswap/ui/dialog'
import { Typography } from '@sushiswap/ui/typography/Typography'
import Link from 'next/link'
import { FC, useState } from 'react'
import { useNetwork } from 'wagmi'

import { DEFAULT_CHAIN_ID } from '../lib/constants'

const ViewAddressModal: FC = () => {
  const { activeChain } = useNetwork()
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState<string>('')
  const chainId = activeChain ? activeChain.id : DEFAULT_CHAIN_ID

  return (
    <div>
      <Button
        onClick={() => setOpen(true)}
        className="transition-all hover:ring-4 ring-gray-700 btn bg-gray-600 btn-filled btn-default w-full text-sm sm:text-base text-slate-50 px-10 h-[44px] sm:!h-[56px] rounded-2xl"
      >
        View Address
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-5 !max-w-lg">
          <Dialog.Header title="View streams attached to address" onClose={() => setOpen(false)} />
          <Typography className="text-slate-400">
            Enter an address to view streams or vested streams assigned to it.
          </Typography>
          <Input.Address
            onChange={setAddress}
            value={address}
            placeholder="Enter an address"
            className="w-full h-[56px] text-base focus:ring-2 !ring-offset-2 !ring-offset-slate-900"
          />
          <div className="inline-flex">
            <Link passHref={true} href={`/users/${address}?chainId=${chainId}`}>
              <Button size="md" className="px-10" color="gradient" disabled={!isAddress(address)}>
                Show me!
              </Button>
            </Link>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}

export default ViewAddressModal
