import React from 'react'
import { ContentBlock } from './ContentBlock'

export const SelectTokensWidget = () => {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">token pair</span> would you like to add liquidity to?
        </>
      }
    >
      <div className="flex relative z-[100]"></div>
    </ContentBlock>
  )
}
