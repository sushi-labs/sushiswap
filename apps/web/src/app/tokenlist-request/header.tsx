import {
  Navigation,
  NavigationElement,
  NavigationElementType,
} from '@sushiswap/ui'
interface HeaderLink {
  name: string
  href: string
  isExternal?: boolean
}

export interface HeaderSection {
  title: string
  href?: string
  links?: HeaderLink[]
  isExternal?: boolean
  className?: string
}

export async function Header() {
  const navData: NavigationElement[] = [
    {
      title: 'Pending',
      href: '/tokenlist-request/pending',
      show: 'everywhere',
      type: NavigationElementType.Single,
    },
    {
      title: 'Approved',
      href: '/tokenlist-request/approved',
      show: 'everywhere',
      type: NavigationElementType.Single,
    },
  ]

  return <Navigation leftElements={navData} />
}
