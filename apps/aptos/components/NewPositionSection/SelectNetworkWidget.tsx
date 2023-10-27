import React, { memo } from 'react'
import { ContentBlock } from '../ContentBlock'
import { Button } from '@sushiswap/ui/future/components/button'

export const SelectNetworkWidget = memo(function SelectNetworkWidget({}) {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">network</span> would you like to provide liquidity on?
        </>
      }
    >
      <div className="flex relative z-[100]">
        <Button color="default" size="xl" variant="outlined" className="!font-medium">
          <img
            src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
            alt=""
            className="rounded-full"
            height={20}
            width={20}
          />
          APTOS
        </Button>
      </div>
    </ContentBlock>
  )
})
