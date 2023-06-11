import { type FooterProps, Footer } from './Footer'
import { type HeaderProps, Header } from './Header'
import { type MainProps, Main } from './Main'
import { type NavProps, Nav } from './Nav'
import { type ShellProps, Shell } from './Shell'

export type AppProps = {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  Footer: FooterProps
}

/**
 * @deprecated
 */
export const App = {
  Header,
  Shell,
  Nav,
  Main,
  Footer,
}
