import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { type TTLStorageKey, useTTL } from '@sushiswap/hooks'
import classNames from 'classnames'
import React, { type FC, useCallback } from 'react'

import { CardDescription, CardHeader, CardTitle } from '../card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPrimitive,
  HoverCardTrigger,
} from '../hover-card'
import { Label } from '../label'
import { TextField } from '../text-field'

export const TransactionDeadline: FC<{
  options: {
    storageKey: TTLStorageKey
    defaultValue?: string
    title?: string
  }
  className?: string
}> = ({ options, className }) => {
  const [ttl, setTTL] = useTTL(options.storageKey)

  const onChange = useCallback(
    (value: string) => {
      setTTL(Number(value))
    },
    [setTTL],
  )

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <div className={classNames(className, 'p-4 rounded-lg')}>
        <div className="gap-2 flex flex-col">
          <div className="flex justify-between gap-[60px]">
            <Label className="flex items-center gap-1">
              {options?.title || 'Deadline'}{' '}
              <HoverCardTrigger>
                <InformationCircleIcon width={16} height={16} />
              </HoverCardTrigger>
              <HoverCardPrimitive.Portal>
                <HoverCardContent className="!p-0 max-w-[320px] z-[1080]">
                  <CardHeader>
                    <CardTitle>Transaction Deadline</CardTitle>
                    <CardDescription className="prose">
                      Your transaction will revert if it is pending for more
                      than this long.
                    </CardDescription>
                  </CardHeader>
                </HoverCardContent>
              </HoverCardPrimitive.Portal>
            </Label>
          </div>
          <TextField
            type="number"
            value={!ttl ? undefined : ttl}
            onValueChange={onChange}
            placeholder={options?.defaultValue ?? '30'}
            id="ttl"
            unit="minutes"
          />
        </div>
      </div>
    </HoverCard>
  )
}
