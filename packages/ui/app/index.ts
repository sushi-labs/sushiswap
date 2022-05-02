import Header, { HeaderProps } from './Header'
import Shell, { ShellProps } from './Shell'
import Nav, { NavProps } from './Nav'
import Main, { MainProps } from './Main'
import Footer, { FooterProps } from './Footer'

export type AppProps = {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  Footer: FooterProps
}

export const App = { Header, Shell, Nav, Main, Footer }
