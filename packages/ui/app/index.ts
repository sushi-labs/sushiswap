import Footer, { FooterProps } from './Footer'
import Header, { HeaderProps } from './Header'
import Main, { MainProps } from './Main'
import Nav, { NavProps } from './Nav'
import Shell, { ShellProps } from './Shell'

export type AppProps = {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  Footer: FooterProps
}

export const App = { Header, Shell, Nav, Main, Footer }
