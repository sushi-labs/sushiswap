import { Transition } from '@headlessui/react'
import { Dots, Typography } from '@sushiswap/ui'
import { FC, Fragment, useState } from 'react'
import { AddSectionStakeWidget } from './AddSectionStakeWidget'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui/future/components/button'

interface AddSectionStakeProps {
  title?: string
}

export const AddSectionStake: FC<{ title?: string }> = ({ title }) => {
  const isMounted = useIsMounted()
  return (
    <Transition
      appear
      show={true}
      enter="transition duration-300 origin-center ease-out"
      enterFrom="transform scale-90 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform opacity-100"
      leaveTo="transform opacity-0"
    >
      <_AddSectionStake title={title} />
    </Transition>
  )
}

const _AddSectionStake: FC<AddSectionStakeProps> = ({ title }) => {
  const [hover, setHover] = useState(false)
  const [value, setValue] = useState('')
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Transition
        show={Boolean()}
        as={Fragment}
        enter="transition duration-300 origin-center ease-out"
        enterFrom="transform opacity-0"
        enterTo="transform opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0"
      >
        <div className="border dark:border-slate-200/5 border-gray-900/5 flex justify-center items-center z-[100] absolute inset-0 backdrop-blur bg-black bg-opacity-[0.24] rounded-2xl">
          <Typography variant="xs" weight={600} className="bg-white bg-opacity-[0.12] rounded-full p-2 px-3">
            No liquidity tokens found, did you add liquidity first?
          </Typography>
        </div>
      </Transition>
      <div className={''}>
        <AddSectionStakeWidget title={title} value={value} setValue={setValue}>
          <Button onClick={() => ''} fullWidth size="xl" variant="filled" disabled testId="stake-liquidity">
            {<Dots>Confirm transaction</Dots>}
          </Button>
        </AddSectionStakeWidget>
      </div>
    </div>
  )
}
