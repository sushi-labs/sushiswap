'use client'
import { classNames } from '@sushiswap/ui'
import { DataItem } from './data-item'

export const DataRow = () => {
  return (
    <div className="grid grid-cols-1 gap-2 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DataItem
        label={'SUSHI in reserve'}
        value={'18,364.61'}
        subLabel={'$4,498.32'}
        isLoading={false}
        isError={false}
      />
      <DataItem
        label={'Average buy price'}
        value={'$0.2343'}
        subLabel={
          <div className="flex items-center gap-1">
            <div
              className={classNames(
                'flex items-center gap-0.5',
                // pctChange > 0?
                'text-green-500',
                // : pctChange === 0
                //   ? 'text-muted-foreground'
                //   : 'text-red-500',
              )}
            >
              {'8.23%'}
            </div>

            <span className="text-muted-foreground">vs spot</span>
          </div>
        }
        isLoading={false}
        isError={false}
      />
      <DataItem
        label={'SUSHI holders'}
        value={'123,123'}
        subLabel={'On Ethereum'}
        isLoading={false}
        isError={false}
        className="col-span-1 sm:col-span-2 lg:col-span-1"
      />
    </div>
  )
}
