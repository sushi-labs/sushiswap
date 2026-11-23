'use client'

import {
  Button,
  FormSection,
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import type { ReactElement } from 'react'
import {
  type EvmChainId,
  getEvmChainById,
  isSushiSwapV2ChainId,
  isSushiSwapV3ChainId,
  // isSushiSwapV4ChainId,
} from 'sushi/evm'

const positionTypes = [
  { value: 'v2', supportsChain: isSushiSwapV2ChainId },
  { value: 'v3', supportsChain: isSushiSwapV3ChainId },
  // { value: 'v4', supportsChain: isSushiSwapV4ChainId },
] as const

interface SelectPositionTypeProps {
  chainId: EvmChainId
  positionType: (typeof positionTypes)[number]['value']
}

export function SelectPositionType({
  chainId,
  positionType,
}: SelectPositionTypeProps): ReactElement {
  const router = useRouter()

  return (
    <FormSection
      title="Position Type"
      description="Select the type of position you would like to create."
    >
      <Select
        value={positionType}
        onValueChange={(value) =>
          router.push(`/${getEvmChainById(chainId).key}/pool/${value}/add`)
        }
      >
        <SelectTrigger className="!w-fit" asChild>
          <Button
            variant="secondary"
            className="!border !border-accent"
            aria-label="Position type"
          >
            <SelectValue>{positionType.toUpperCase()}</SelectValue>
            <SelectIcon />
          </Button>
        </SelectTrigger>
        <SelectContent>
          {positionTypes.map(({ value, supportsChain }) => (
            <SelectItem
              key={value}
              value={value}
              disabled={!supportsChain(chainId)}
            >
              {value.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormSection>
  )
}
