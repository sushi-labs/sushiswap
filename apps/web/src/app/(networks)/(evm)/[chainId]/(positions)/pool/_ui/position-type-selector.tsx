'use client'
import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@sushiswap/ui'
import { usePositionFilters } from './position-filters-provider'

export const PositionTypeSelector = () => {
  const {
    state: { tab, tabOptions },
    mutate: { setTab },
  } = usePositionFilters()
  return (
    <Select value={tab} onValueChange={setTab}>
      <SelectTrigger className="!w-fit !border !border-accent" asChild>
        <Button
          icon={ChevronDownIcon}
          aria-label="Select a protocol"
          variant="secondary"
          size="sm"
          iconPosition="end"
          className="!text-muted-foreground !min-h-[36px] !h-[36px] focus:!bg-secondary"
        >
          <SelectValue placeholder="Select protocol" />
        </Button>
      </SelectTrigger>

      <SelectContent>
        {tabOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.children}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
