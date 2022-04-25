import Header from './Header'
import Shell from './Shell'
import Nav from './Nav'
import { FC } from 'react'

export type AppProps = {
  Header: FC<{}>
  Shell: FC<{}>
  Nav: FC<{}>
}

export const App: AppProps = { Header, Shell, Nav }
