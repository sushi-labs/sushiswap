import { ChainId } from '@sushiswap/chain'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { Button, Dialog, NetworkIcon, Typography } from '@sushiswap/ui'
import { SUPPORTED_CHAINS } from './../config'
import React, { FC, useState } from 'react'

interface NetworkModal {
  chainId: ChainId
  setChainId: (chainId: ChainId) => void
}

export const NetworkModal: FC<NetworkModal> = ({ chainId, setChainId }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button key={chainId} color="gray" onClick={() => setOpen(true)} className="flex !justify-start">
        <NetworkIcon type="circle" chainId={chainId} width={28} height={28} />
        <Typography>{CHAIN_NAME[chainId]}</Typography>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Content className="space-y-3 !pb-4">
          <Dialog.Header title="Select a network" onClose={() => setOpen(false)} />
          <div className="grid grid-flow-row-dense grid-cols-1 gap-4 p-1 overflow-y-auto md:grid-cols-2">
            {SUPPORTED_CHAINS.map((key) => (
              <Button
                key={key}
                color="gray"
                onClick={() => {
                  setChainId(key)
                  setOpen(false)
                }}
                className="flex !justify-start"
              >
                <NetworkIcon type="circle" chainId={key} width={28} height={28} />
                <Typography>{CHAIN_NAME[key]}</Typography>
              </Button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog>
    </>
  )
}
