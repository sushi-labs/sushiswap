import { type FooterProps, Footer } from './Footer'
import { type HeaderProps, Header } from './Header'
import { type MainProps, Main } from './Main'
import { type NavProps, Nav } from './Nav'
import { NavItem, NavItemExternal, NavItemInternal, NavItemProps } from './NavItem'
import { NavItemList, NavItemListProps } from './NavItemList'
import { type ShellProps, Shell } from './Shell'

export type AppProps = {
  Header: HeaderProps
  Shell: ShellProps
  Nav: NavProps
  Main: MainProps
  Footer: FooterProps
  NavItem: NavItemProps
  NavItemInternal: NavItemProps
  NavItemExternal: NavItemProps
  NavItemList: NavItemListProps
}

export const App = { Header, Shell, Nav, NavItem, NavItemInternal, NavItemExternal, NavItemList, Main, Footer }

export { AppType } from './Header'
