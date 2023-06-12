import { Protocol } from '@sushiswap/client'
import { Button } from '@sushiswap/ui/future/components/button'
import { ChainFilter, SearchFilter, useFilters } from 'components/Filters'
import { SUPPORTED_CHAIN_IDS } from 'config'
import React, { FC, useCallback } from 'react'

export const PoolFilters: FC = () => {
  const { poolProtocols: protocols, isWhitelisted, setFilters } = useFilters()

  const protocolHandler = useCallback(
    (item: Protocol) => {
      const newProtocols = protocols?.includes(item)
        ? protocols.filter((el) => el !== item)
        : [...(protocols || []), item]

      setFilters({
        poolProtocols: newProtocols.length === 0 ? undefined : newProtocols,
      })
    },
    [protocols, setFilters],
  )

  const whitelistedHandler = useCallback(() => {
    setFilters({
      isWhitelisted: !isWhitelisted,
    })
  }, [isWhitelisted, setFilters])

  return (
    <div className='flex flex-col gap-4 mb-4'>
      <div className='flex gap-4'>
        <SearchFilter />
        <ChainFilter availableChainIds={SUPPORTED_CHAIN_IDS} />
      </div>
      <div className='flex flex-wrap items-center gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <Button
            className='items-center gap-2.5'
            onClick={() => protocolHandler(Protocol.SUSHISWAP_V3)}
            size='sm'
            variant='outlined'
            color={
              protocols?.includes(Protocol.SUSHISWAP_V3) ? 'blue' : 'default'
            }
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v3</sup>
            </span>
          </Button>
          <Button
            className='gap-2.5'
            onClick={() => protocolHandler(Protocol.SUSHISWAP_V2)}
            size='sm'
            variant='outlined'
            color={
              protocols?.includes(Protocol.SUSHISWAP_V2) ? 'blue' : 'default'
            }
          >
            <span>🍣</span>{' '}
            <span>
              SushiSwap <sup>v2</sup>
            </span>
          </Button>

          <Button
            className='flex items-center gap-2.5'
            onClick={() => protocolHandler(Protocol.BENTOBOX_STABLE)}
            size='sm'
            variant='outlined'
            color={
              protocols?.includes(Protocol.BENTOBOX_STABLE) ? 'blue' : 'default'
            }
          >
            <span className='mt-1'>🍱</span>
            <span>Trident Stable</span>
          </Button>
          <Button
            className='flex items-center gap-2.5'
            onClick={() => protocolHandler(Protocol.BENTOBOX_CLASSIC)}
            size='sm'
            variant='outlined'
            color={
              protocols?.includes(Protocol.BENTOBOX_CLASSIC)
                ? 'blue'
                : 'default'
            }
          >
            <span className='mt-1'>🍱</span>
            <span>Trident Classic</span>
          </Button>
          {process.env.NODE_ENV !== 'production' && (
            <Button
              onClick={() => whitelistedHandler()}
              size='sm'
              variant='outlined'
              color={isWhitelisted ? 'blue' : 'default'}
              className='flex gap-2.5'
            >
              <span>Whitelisted</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
