import classNames from 'classnames'
import { FC, ReactNode } from 'react'

import Container, { MaxWidth } from '../Container'
import { WidgetContent, WidgetContentProps } from './WidgetContent'
import { WidgetHeader, WidgetHeaderProps } from './WidgetHeader'

interface WidgetRootProps {
  id: string
  className?: string
  children: ReactNode
  maxWidth: MaxWidth | number
}

const WidgetRoot: FC<WidgetRootProps> = ({ id, className, maxWidth, children }) => {
  return (
    <Container
      as="article"
      id={id}
      {...(typeof maxWidth === 'string' && { maxWidth })}
      style={{
        ...(typeof maxWidth === 'number' && { maxWidth }),
      }}
      className={classNames(
        className,
        'flex flex-col mx-auto rounded-2xl relative overflow-hidden dark:shadow dark:shadow-slate-900 bg-white dark:bg-slate-800'
      )}
    >
      {children}
    </Container>
  )
}

export const Widget: FC<WidgetRootProps> & {
  Header: FC<WidgetHeaderProps>
  Content: FC<WidgetContentProps>
} = Object.assign(WidgetRoot, {
  Header: WidgetHeader,
  Content: WidgetContent,
})
