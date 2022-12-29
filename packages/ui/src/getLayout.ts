import type { ComponentType } from 'react'
import { Noop } from './Noop'

export function getLayout<LP extends {}>(Component: ComponentType<any>): ComponentType<LP> {
  return (Component as any).Layout || Noop
}
