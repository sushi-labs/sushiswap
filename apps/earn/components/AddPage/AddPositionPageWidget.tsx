import { Widget as UIWidget } from '@sushiswap/ui/future/components/widget'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { PlusIcon } from '@heroicons/react/outline'
import { ContentBlock } from './ContentBlock'
import React from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'
import { AddPositionReviewButton } from './AddPositionReviewButton'

export const AddPositionPageWidget = () => {
  const { chainId, token0, token1, value0, value1 } = useAddPositionState()
  const { setValue0, setValue1, setToken0, setToken1 } = useAddPositionActions()

  return (
    <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
      <div className="flex flex-grow">
        <UIWidget.Content>
          <div className="flex flex-col gap-4 w-[360px]">
            <Web3Input.Currency
              type="INPUT"
              className="p-3 dark:bg-slate-800 bg-white rounded-xl"
              chainId={chainId}
              value={value0}
              onChange={setValue0}
              onSelect={setToken0}
              currency={token0}
              disabled={!token0}
            />
            <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
              <button type="button" className="p-2 bg-gray-100 dark:bg-slate-900 rounded-full z-10">
                <PlusIcon strokeWidth={3} className="w-4 h-4 text-gray-500 dark:text-slate-400 text-slate-600" />
              </button>
            </div>
            <Web3Input.Currency
              type="INPUT"
              className="p-3 dark:bg-slate-800 bg-white rounded-xl"
              chainId={chainId}
              value={value1}
              onChange={setValue1}
              onSelect={setToken1}
              currency={token1}
              disabled={!token1}
            />
            <AddPositionReviewButton />
          </div>
        </UIWidget.Content>
      </div>
    </ContentBlock>
  )
}
