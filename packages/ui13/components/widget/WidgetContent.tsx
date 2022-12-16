import { FC, ReactElement } from 'react'

export interface WidgetContentProps {
  children: ReactElement | Array<ReactElement>
}

export const WidgetContent: FC<WidgetContentProps> = ({ children }) => {
  return <div>{children}</div>
}
