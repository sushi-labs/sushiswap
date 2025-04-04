import {
  Button,
  Navigation,
  NavigationElementType,
  Separator,
} from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import Link from 'next/link'
import { getSessionData } from '../../lib/client-config'
import { HeaderLogo } from './header-logo'
import { HeaderProfile } from './header-profile'

export async function Header() {
  const session = await getSessionData()
  const showDashboard = session.isLoggedIn && session.user.email.isVerified

  return (
    <div className="flex z-20">
      <Navigation
        className="!pl-0 lg:!pl-4 !z-[unset]"
        hideSushiDropdown
        leftElements={[
          {
            item: <SushiIcon width={24} height={24} className="mr-2" />,
            href: '/portal',
            show: 'mobile',
            type: NavigationElementType.Custom,
          },
          {
            item: (
              <div className="flex flex-row pr-4">
                <SushiIcon width={24} height={24} className="mr-2" />
                <HeaderLogo height={24} />
              </div>
            ),
            href: '/portal',
            show: 'desktop',
            type: NavigationElementType.Custom,
          },
          {
            item: (
              <div className="h-6">
                <Separator orientation="vertical" />
              </div>
            ),
            show: 'desktop',
            type: NavigationElementType.Custom,
          },
          {
            title: 'Dashboard',
            href: '/portal/dashboard',
            show: showDashboard ? 'everywhere' : 'never',
            type: NavigationElementType.Single,
          },
          {
            title: 'Pricing',
            href: '/portal/pricing',
            show: 'everywhere',
            type: NavigationElementType.Single,
          },
          {
            title: 'Docs',
            href: 'https://docs.sushi.com',
            show: 'everywhere',
            type: NavigationElementType.Single,
          },
          {
            title: 'Support',
            href: 'https://sushi.com',
            show: 'everywhere',
            type: NavigationElementType.Single,
          },
        ]}
        rightElement={<HeaderProfile />}
      />
    </div>
  )
}
