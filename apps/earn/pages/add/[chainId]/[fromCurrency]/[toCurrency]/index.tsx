import { Container } from '@sushiswap/ui'
import React from 'react'
import { AddPositionProvider } from '../../../../../components/AddPage/AddPositionProvider'
import { SelectNetworkContentBlock } from '../../../../../components/AddPage/SelectNetworkContentBlock'
import { SelectTokensContentBlock } from '../../../../../components/AddPage/SelectTokensContentBlock'
import { SelectFeeContentBlock } from '../../../../../components/AddPage/SelectFeeContentBlock'
import { SelectPoolTypeContentBlock } from '../../../../../components/AddPage/SelectPoolTypeContentBlock'
import { AddPositionPageWidget } from '../../../../../components/AddPage/AddPositionPageWidget'
import { AddPositionReviewModal } from '../../../../../components/AddPage/AddPositionReviewModal'

export const Add = () => {
  return (
    <AddPositionProvider>
      <Container maxWidth="5xl" className="mx-auto py-40">
        <div className="flex flex-col gap-14">
          <SelectNetworkContentBlock />
          <div className="h-px w-full dark:bg-slate-200/5 bg-gray-200" />
          <SelectTokensContentBlock />
          <div className="h-px w-full dark:bg-slate-200/5 bg-gray-200" />
          <SelectPoolTypeContentBlock />
          <div className="h-px w-full dark:bg-slate-200/5 bg-gray-200" />
          <SelectFeeContentBlock />
          <div className="h-px w-full dark:bg-slate-200/5 bg-gray-200" />
          <AddPositionPageWidget />
          <AddPositionReviewModal />
        </div>
      </Container>
    </AddPositionProvider>
  )
}

export default Add
