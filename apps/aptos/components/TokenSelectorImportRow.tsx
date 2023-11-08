import {
  ArrowTopRightOnSquareIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import React, { ReactNode, useCallback, useState } from 'react'
import { Token } from 'utils/tokenType'
import { Icon } from './Icon'
import { providerNetwork } from 'lib/constants'
import { Button, List } from '@sushiswap/ui'
import { Modal } from './Modal/Modal'
interface Props {
  id: string
  token: Token[]
  onImport(): void
}

export const TokenSelectorImportRow = ({ id, token, onImport }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const onClick = useCallback(() => {
    onImport()

    setTimeout(() => {
      setOpen(false)
    }, 250)
  }, [onImport])
  return (
    <>
      <div className="py-0.5 h-[64px]">
        <div className="flex items-center w-full h-full rounded-lg px-3">
          <div className="flex items-center justify-between flex-grow gap-2 rounded">
            <div className="flex flex-row items-center flex-grow gap-4">
              <Icon currency={token[0]} height={40} width={40} />
              <div className="flex flex-col items-start">
                <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                  {token[0].symbol}
                </span>
                <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                  {token[0].name}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <Button
                className="rounded-full"
                color="blue"
                size="xs"
                onClick={() => setOpen(true)}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SlideIn.FromRight show={open} onClose={() => setOpen(false)}>
        <Overlay.Content className="bg-white dark:bg-slate-800 !pb-0">
          <Overlay.Header onBack={() => setOpen(false)} title="" />

          <div className="space-y-3 my-3">
            <div className="rounded-2xl p-3 flex flex-col gap-2 items-center">
              <ExclamationTriangleIcon
                width={26}
                height={26}
                className="text-red"
              />
              <span className="font-medium text-lg text-gray-900 dark:text-slate-200">
                Trade at your own risk!
              </span>
              <span className="text-sm text-gray-600 dark:text-slate-400 text-center">
                {token.length > 1 ? "These tokens don't" : "This token doesn't"}{' '}
                appear on the active token list(s). Anyone can create a token,
                including creating fake versions of existing tokens that claim
                to represent projects
              </span>
            </div>
            <List>
              <List.Control>
                {token.reduce<ReactNode[]>((acc, cur) => {
                  if (cur) {
                    acc.push(
                      <div className="py-0.5 h-[64px]" key={cur.address}>
                        <div className="flex items-center w-full h-full rounded-lg px-3">
                          <div className="flex items-center justify-between flex-grow gap-2 rounded">
                            <div className="flex flex-row items-center flex-grow gap-4">
                              <Icon currency={cur} height={40} width={40} />
                              <div className="flex flex-col items-start">
                                <span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                                  {cur.symbol}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
                                  {cur.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col">
                              <span className="text-right font-medium text-sm text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
                                {cur.address.substring(0, 6)} ...{' '}
                                {cur.address.split('::')[0].substring(66 - 4)}
                              </span>
                              <a
                                target="_blank"
                                href={`https://explorer.aptoslabs.com/account/${
                                  cur.address.split('::')[0]
                                }?network=${providerNetwork}`}
                                className="flex gap-1 text-sm items-center text-blue font-medium justify-end"
                                rel="noreferrer"
                              >
                                View on Explorer{' '}
                                <ArrowTopRightOnSquareIcon
                                  width={14}
                                  height={14}
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>,
                    )
                  }
                  return acc
                }, [])}
              </List.Control>
            </List>
            <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1">
              <Modal.Trigger tag={`${id}-token-selector-modal`}>
                {({ close }) => (
                  <Button
                    fullWidth
                    color="blue"
                    onClick={() => {
                      onClick()
                      close()
                    }}
                  >
                    Import
                  </Button>
                )}
              </Modal.Trigger>
            </div>
          </div>
        </Overlay.Content>
      </SlideIn.FromRight>
    </>
  )
}
