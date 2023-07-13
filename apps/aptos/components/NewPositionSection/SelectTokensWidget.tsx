import React, { Dispatch, FC, SetStateAction } from 'react'
import { ContentBlock } from '../ContentBlock'
import TokenListDialog from '../TokenListDialog'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Token } from 'utils/tokenType'
import { usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'

export const SelectTokensWidget: FC = ({}) => {
  const { token0, token1 } = usePoolState()
  const { setToken0, setToken1 } = usePoolActions()
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">token pair</span> would you like to add liquidity to?
        </>
      }
    >
      <div className="flex gap-3">
        <TokenListDialog selected={token0} handleChangeToken={setToken0}>
          {({ setOpen }) => (
            <button
              onClick={(e) => {
                setOpen(true)
                e.stopPropagation()
              }}
              id="swap-from-button"
              type="button"
              testdata-id="swap-from-button"
              className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
            >
              <div className="w-[28px] h-[28px] mr-0.5">
                <img
                  src={token0.logoURI}
                  alt={''}
                  height={28}
                  width={28}
                  decoding="async"
                  loading="lazy"
                  data-nimg={1}
                  className="rounded-full"
                  style={{ color: 'transparent' }}
                />
              </div>
              {/* {currency.name} */}
              {token0.symbol}
              <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
            </button>
          )}
        </TokenListDialog>
        <TokenListDialog selected={token1} handleChangeToken={setToken1}>
          {({ setOpen }) => (
            <button
              onClick={(e) => {
                setOpen(true)
                e.stopPropagation()
              }}
              id="swap-from-button"
              type="button"
              testdata-id="swap-from-button"
              className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
            >
              <div className="w-[28px] h-[28px] mr-0.5">
                <img
                  src={token1.logoURI}
                  alt={''}
                  height={28}
                  width={28}
                  decoding="async"
                  loading="lazy"
                  data-nimg={1}
                  className="rounded-full"
                  style={{ color: 'transparent' }}
                />
              </div>
              {token1.name}

              <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
            </button>
          )}
        </TokenListDialog>
        <div
          style={{
            position: 'fixed',
            top: '1px',
            left: '1px',
            width: '1px',
            height: '0px',
            padding: '0px',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0px, 0px, 0px, 0px)',
            whiteSpace: 'nowrap',
            borderWidth: '0px',
            display: 'none',
          }}
        />
      </div>
    </ContentBlock>
  )
}
