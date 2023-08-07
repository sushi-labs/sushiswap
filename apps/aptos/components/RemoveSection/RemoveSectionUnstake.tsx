import { AppearOnMount, Dots } from '@sushiswap/ui'
import { FC, useState } from 'react'
import { RemoveSectionUnstakeWidget } from './RemoveSectionUnstakeWidget'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/future/components/button'

interface AddSectionStakeProps {}

export const RemoveSectionUnstake: FC<{}> = ({}) => {
  const isMounted = useIsMounted()
  return (
    <AppearOnMount show={true}>
      <_RemoveSectionUnstake />
    </AppearOnMount>
  )
}

export const _RemoveSectionUnstake: FC<AddSectionStakeProps> = ({}) => {
  const [value, setValue] = useState('')
  return (
    <RemoveSectionUnstakeWidget value={value} setValue={setValue}>
      <Button onClick={() => {}} fullWidth size="xl" variant="filled" disabled={() => {}} testId="unstake-liquidity">
        {<Dots>Confirm transaction</Dots>}
      </Button>
    </RemoveSectionUnstakeWidget>
  )
}
