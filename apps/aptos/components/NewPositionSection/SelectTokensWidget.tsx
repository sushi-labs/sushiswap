import React, { FC } from 'react'
import { ContentBlock } from '../ContentBlock'
import TokenListDialog from '../TokenListDialog'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { usePoolActions, usePoolState } from 'app/pool/Pool/PoolProvider'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { Icon } from 'components/Icon'
interface Props {
  handleSwap: () => void
}
export const SelectTokensWidget: FC<Props> = ({ handleSwap }) => {
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
        <TokenListDialog
          alteredSelected={token1}
          id={`liquidity-from-0`}
          selected={token0}
          handleSwap={handleSwap}
          handleChangeToken={setToken0}
        >
          <Modal.Trigger tag={`liquidity-from-0-token-selector-modal`}>
            {({ open }) => (
              <>
                <button
                  onClick={open}
                  id="swap-from-button"
                  type="button"
                  testdata-id="swap-from-button"
                  className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
                >
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Icon currency={token0} height={28} width={28} />
                    {/* <img
                      src={token0.logoURI}
                      alt={''}
                      height={28}
                      width={28}
                      decoding="async"
                      loading="lazy"
                      data-nimg={1}
                      className="rounded-full"
                      style={{ color: 'transparent' }}
                    /> */}
                  </div>
                  {token0.symbol}
                  <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
                </button>
              </>
            )}
          </Modal.Trigger>
        </TokenListDialog>
        <TokenListDialog
          id={`liquidity-to-1`}
          selected={token1}
          alteredSelected={token0}
          handleChangeToken={setToken1}
          handleSwap={handleSwap}
        >
          <Modal.Trigger tag={`liquidity-to-1-token-selector-modal`}>
            {({ open }) => (
              <>
                <button
                  onClick={open}
                  id="swap-from-button"
                  type="button"
                  testdata-id="swap-from-button"
                  className="flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.06] hover:dark:bg-white/[0.12] whitespace-nowrap"
                >
                  <div className="w-[28px] h-[28px] mr-0.5">
                    <Icon currency={token1} height={28} width={28} />
                    {/* <img
                      src={token1.logoURI}
                      alt={''}
                      height={28}
                      width={28}
                      decoding="async"
                      loading="lazy"
                      data-nimg={1}
                      className="rounded-full"
                      style={{ color: 'transparent' }}
                    /> */}
                  </div>
                  {token1.symbol}

                  <ChevronDownIcon className="ml-1" strokeWidth={3} width={16} height={16} />
                </button>
              </>
            )}
          </Modal.Trigger>
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
