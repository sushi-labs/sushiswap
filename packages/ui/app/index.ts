import Header, { HeaderProps } from './Header'
import Shell, { ShellProps } from './Shell'
import Nav, { NavProps } from './Nav'
import Footer, { FooterProps } from './Footer'
import { FC } from 'react'

export type AppProps = {
  Header: FC<HeaderProps>
  Shell: FC<ShellProps>
  Nav: FC<NavProps>
  Footer: FC<FooterProps>
}

export const App: AppProps = { Header, Shell, Nav, Footer }
