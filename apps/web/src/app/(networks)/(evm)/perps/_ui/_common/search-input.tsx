'use client'
import { XIcon } from '@heroicons/react-v1/solid'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { IconButton, TextField, classNames } from '@sushiswap/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { PerpsCard } from '~evm/perps/_ui/_common'

export const SearchInput = ({
  value,
  setValue,
}: {
  value: string
  setValue: (value: string) => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center justify-end overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {!open ? (
          <motion.div
            key="search-button"
            initial={{ opacity: 0, scale: 0.9, x: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <IconButton
              icon={MagnifyingGlassIcon}
              name="open search"
              onClick={() => setOpen(true)}
              variant="perps-secondary"
              size="sm"
              className="!rounded-xl !text-perps-muted-50"
            />
          </motion.div>
        ) : (
          <motion.div
            key="search-input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <PerpsCard className="flex items-center gap-2" rounded="xl">
              <div className="relative w-full">
                <TextField
                  placeholder="Search"
                  icon={MagnifyingGlassIcon}
                  iconProps={{
                    className: 'text-perps-muted-50',
                  }}
                  type="text"
                  value={value}
                  onValueChange={setValue}
                  className="!bg-transparent mr-6"
                  id="asset-search"
                  wrapperClassName="!h-[34px]"
                  autoFocus
                />

                <div
                  className={classNames(
                    'absolute right-2 top-1/2 -translate-y-1/2',
                  )}
                >
                  <IconButton
                    icon={XIcon}
                    name="close search"
                    onClick={() => {
                      setValue('')
                      setOpen(false)
                    }}
                    variant="ghost"
                    size="xs"
                  />
                </div>
              </div>
            </PerpsCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
