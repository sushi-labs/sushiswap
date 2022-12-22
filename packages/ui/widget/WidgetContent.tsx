import { FC, ReactElement } from 'react'

export interface WidgetContentProps {
  children: ReactElement | Array<ReactElement>
  className?: string
}

export const WidgetContent: FC<WidgetContentProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>
}
