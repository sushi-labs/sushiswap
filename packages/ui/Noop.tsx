import type { FC, ReactNode, ComponentType, HTMLAttributes } from 'react'

export const Noop: FC<{ children?: ReactNode }> = ({ children }) => <>{children}</>
