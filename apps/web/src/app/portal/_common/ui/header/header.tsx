import {
  Button,
  Navigation,
  NavigationElementType,
  Separator,
} from '@sushiswap/ui'
import { SushiLabsIcon } from '@sushiswap/ui/icons/SushiLabsIcon'
import { getSessionData } from '../../lib/client-config'
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
            item: (
              <SushiLabsIcon
                width={24}
                height={24}
                className="mr-2 fill-white"
              />
            ),
            href: '/portal',
            show: 'everywhere',
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
            href: 'https://docs.sushi.com/developer-portal',
            show: 'everywhere',
            type: NavigationElementType.Single,
          },
          // {
          //   title: 'Support',
          //   href: '/portal/support',
          //   show: 'everywhere',
          //   type: NavigationElementType.Single,
          // },
        ]}
        rightElement={<HeaderProfile />}
      />
    </div>
  )
}
