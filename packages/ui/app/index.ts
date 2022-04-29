import Header from './Header'
import Shell from './Shell'
import Nav from './Nav'
import { FC } from 'react'

export type AppProps = {
  Header: FC<{
    children?: React.ReactNode
  }>
  Shell: FC<{
    children?: React.ReactNode
  }>
  Nav: FC<{
    children?: React.ReactNode
  }>
}

export const App: AppProps = { Header, Shell, Nav }
