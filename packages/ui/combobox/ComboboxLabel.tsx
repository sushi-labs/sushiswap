import { Combobox as HeadlessCombobox } from '@headlessui/react'
import classNames from 'classnames'
import { FC, Fragment } from 'react'

import { ExtractProps } from '../types'
import { Typography } from '../typography'

export type ComboboxLabelProps = ExtractProps<typeof HeadlessCombobox.Label> & {
  children: string
}

const ComboboxLabel: FC<ComboboxLabelProps> = ({ className, children, ...props }) => {
  return (
    <HeadlessCombobox.Label {...props} as={Fragment}>
      <Typography variant="sm" weight={500} className={classNames(className, 'text-high-emphesis')}>
        {children}
      </Typography>
    </HeadlessCombobox.Label>
  )
}

export default ComboboxLabel
