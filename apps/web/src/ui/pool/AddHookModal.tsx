'use client'

import { DocumentDuplicateIcon, XIcon } from '@heroicons/react-v1/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import {
  Button,
  ClipboardController,
  DialogClose,
  DialogContent,
  DialogCustom,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProvider,
  DialogReview,
  DialogTitle,
  DialogTrigger,
  DialogType,
  Dots,
  IconButton,
  List,
  Message,
  TextField,
  classNames,
  useDialog,
} from '@sushiswap/ui'
import { ContractIcon } from '@sushiswap/ui/icons/ContractIcon'
import React, { useEffect, useState, useMemo } from 'react'
import type { HooksRegistration } from 'src/lib/pool/v4'
import { decodeHooksRegistration } from 'src/lib/pool/v4/sdk/utils/decodeHooksRegistration'
import { shortenAddress } from 'sushi/format'
import { zeroAddress } from 'viem'
import { isAddress } from 'viem/utils'
import { useReadContract } from 'wagmi'
import { useConcentratedLiquidityURLStateV4 } from './ConcentratedLiquidityURLStateProviderV4'

const abiShard = [
  {
    type: 'function',
    name: 'getHooksRegistrationBitmap',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint16',
        internalType: 'uint16',
      },
    ],
    stateMutability: 'pure',
  },
] as const

export const AddHookModal = () => {
  return (
    <DialogProvider>
      <_AddHookModal />
    </DialogProvider>
  )
}

const _AddHookModal = () => {
  const { chainId, hook, setHook, hookData, setHookData } =
    useConcentratedLiquidityURLStateV4()

  const [localValue, setLocalValue] = useState(hook ?? '')

  const {
    data: hooksRegistration,
    isLoading: isHooksRegistrationLoading,
    isError: isHooksResgistrationError,
  } = useReadContract({
    chainId,
    address: isAddress(localValue, { strict: false }) ? localValue : undefined,
    abi: abiShard,
    functionName: 'getHooksRegistrationBitmap',
    args: [],
    query: {
      staleTime: Number.POSITIVE_INFINITY,
      enabled: isAddress(localValue, { strict: false }),
    },
  })

  const decodedHooksRegistration = useMemo(
    () =>
      hooksRegistration
        ? decodeHooksRegistration(hooksRegistration)
        : undefined,
    [hooksRegistration],
  )

  // sync w/ hook from URL
  useEffect(() => {
    if (
      decodedHooksRegistration &&
      hook &&
      isAddress(hook) &&
      hookData?.address !== hook
    ) {
      setHookData({
        address: hook,
        hooksRegistration: decodedHooksRegistration,
      })
    }
  }, [hook, decodedHooksRegistration, hookData, setHookData])

  const isError =
    (localValue && !isAddress(localValue)) || isHooksResgistrationError

  const onConfirm = () => {
    if (isAddress(localValue)) {
      setHook(localValue)
    }
  }

  const onRemove = () => {
    setHook(undefined)
    setHookData(undefined)
  }

  const { setOpen: setOpenConfirmDialog } = useDialog(DialogType.Confirm)

  const { hooksRegistrationInfo, hasDangerous } = useMemo(() => {
    if (!decodedHooksRegistration) {
      return {
        hooksRegistrationInfo: [],
        hasDangerous: false,
      }
    }
    const hooksRegistrationInfo = getHooksRegistrationInfo(
      decodedHooksRegistration,
    )

    return {
      hooksRegistrationInfo,
      hasDangerous: hooksRegistrationInfo.some(
        ({ isDangerous }) => isDangerous,
      ),
    }
  }, [decodedHooksRegistration])

  return (
    <>
      <DialogReview>
        {({ confirm }) => (
          <>
            <div>
              {hook ? (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="!pl-2.5 !pr-1 flex items-center !gap-1"
                    icon={ContractIcon}
                    onClick={() => setOpenConfirmDialog(true)}
                  >
                    <span className="font-medium">{shortenAddress(hook)}</span>
                    <ClipboardController hideTooltip>
                      {({ setCopied, isCopied }) => (
                        <IconButton
                          className="text-muted-foreground"
                          variant="ghost"
                          size="xs"
                          icon={DocumentDuplicateIcon}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCopied(hook)
                          }}
                          description={isCopied ? 'Copied!' : 'Copy Address'}
                          name="Copy"
                        />
                      )}
                    </ClipboardController>
                  </Button>
                  <Button variant="link" onClick={onRemove} className="!gap-1 ">
                    <div>
                      <XIcon width={16} height={16} />
                    </div>
                    Remove
                  </Button>
                </div>
              ) : (
                <DialogTrigger asChild>
                  <Button variant="link" icon={ContractIcon} className="mb-4">
                    <span className="font-medium">Add a hook</span>
                  </Button>
                </DialogTrigger>
              )}
            </div>
            <DialogContent>
              <HookDialogHeader />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Hook Address
                  </span>
                  <TextField
                    type="text"
                    placeholder={zeroAddress}
                    value={localValue}
                    onValueChange={(value) => setLocalValue(value)}
                  />
                </div>
                {isError ? (
                  <Message
                    variant="destructive"
                    size="sm"
                    className={'!p-4 cursor-pointer'}
                  >
                    Please enter a valid hook.
                  </Message>
                ) : null}
              </div>
              <DialogFooter>
                <Button
                  fullWidth
                  size="xl"
                  disabled={!hooksRegistration}
                  loading={isHooksRegistrationLoading}
                  onClick={confirm}
                >
                  {isHooksRegistrationLoading ? (
                    <Dots>Validating</Dots>
                  ) : (
                    'Next'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
      </DialogReview>
      <DialogCustom dialogType={DialogType.Confirm}>
        <DialogContent>
          {hasDangerous ? (
            <DialogHeader>
              <div>
                <ExclamationTriangleIcon
                  width={44}
                  height={44}
                  className="text-red bg-red/10 p-2 rounded-full"
                />
              </div>
              <DialogTitle>High risk hook detected</DialogTitle>
              <DialogDescription>
                We’ve identified potential risks with this hook. Please review
                carefully before you proceed.
              </DialogDescription>
            </DialogHeader>
          ) : (
            <HookDialogHeader />
          )}
          <div className="flex flex-col gap-5">
            <List>
              <List.Label className="!text-sm">General</List.Label>
              <List.Control>
                <List.KeyValue
                  flex
                  title="Hook Address"
                  className="whitespace-nowrap"
                >
                  {hookData || isAddress(localValue) ? (
                    <div className="flex gap-1 items-center">
                      <span>
                        {shortenAddress(hookData?.address ?? localValue)}
                      </span>
                      <ClipboardController hideTooltip>
                        {({ setCopied, isCopied }) => (
                          <IconButton
                            className="text-muted-foreground"
                            variant="ghost"
                            size="xs"
                            icon={DocumentDuplicateIcon}
                            onClick={(e) => {
                              e.stopPropagation()
                              setCopied(hookData?.address ?? localValue)
                            }}
                            description={isCopied ? 'Copied!' : 'Copy Address'}
                            name="Copy"
                          />
                        )}
                      </ClipboardController>
                    </div>
                  ) : null}
                </List.KeyValue>
              </List.Control>
            </List>
            <List>
              <List.Label className="!text-sm">Properties</List.Label>
              <List.Control>
                {hooksRegistrationInfo.map(
                  ({ name, description, isDangerous }) => {
                    return (
                      <List.Item
                        icon={undefined}
                        iconProps={undefined}
                        key={name}
                        title={
                          <span
                            className={isDangerous ? 'text-red' : undefined}
                          >
                            {name}
                          </span>
                        }
                        subtitle={
                          <span
                            className={classNames(
                              '!text-sm',
                              isDangerous ? 'text-red' : undefined,
                            )}
                          >
                            {description}
                          </span>
                        }
                      />
                    )
                  },
                )}
              </List.Control>
            </List>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                fullWidth
                variant={hasDangerous ? 'destructive' : 'default'}
                size="xl"
                disabled={isError}
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogCustom>
    </>
  )
}

const HookDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Add hook</DialogTitle>
      <DialogDescription>
        Hooks are an advanced feature that enable pools to interact with smart
        contracts, unlocking various capabilities. Exercise caution when adding
        hooks, as some may be malicious or cause unintended consequences.
      </DialogDescription>
    </DialogHeader>
  )
}

const getHooksRegistrationInfo = (hooksRegistration: HooksRegistration) => {
  const info = Object.entries(hooksRegistration)
    .map(([key, value]) => {
      if (!value) return undefined
      switch (key) {
        case 'beforeSwap':
        case 'beforeSwapReturnsDelta':
          return {
            name: 'Swap',
            description:
              'May allow sophisticated users to more easily leverage Just-In-Time liquidity resulting in lower fees earned.',
            isDangerous: false,
          }
        case 'beforeAddLiquidity':
        case 'afterAddLiquidity':
          return {
            name: 'Add liquidity',
            description:
              'May cause the pool to block the addition of new liquidity. Your transaction may revert.',
            isDangerous: false,
          }
        case 'beforeRemoveLiquidity':
        case 'afterRemoveLiquidity':
          return {
            name: 'Remove liquidity',
            description:
              'May result in your funds being locked or prevent you from collecting fees.',
            isDangerous: true,
          }
        case 'beforeDonate':
        case 'afterDonate':
          return {
            name: 'Donate',
            description: 'May impact the fees you receive',
            isDangerous: false,
          }
        default:
          return undefined
      }
    })
    .filter((value) => !!value)

  return info
}
