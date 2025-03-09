import { Navigation, NavigationElementType } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { getSessionData } from '../../lib/client-config'
import { HeaderProfile } from './header-profile'

export async function Header() {
  const session = await getSessionData()

  return (
    <div className="flex z-20">
      <Navigation
        className="!pl-0 lg:!pl-4 !z-[unset]"
        hideSushiDropdown
        leftElements={[
          {
            item: <SushiIcon width={24} height={24} className="mr-2" />,
            href: '/portal',
            show: 'everywhere',
            type: NavigationElementType.Custom,
          },
          ...(session.isLoggedIn && session.user.email.isVerified
            ? [
                {
                  title: 'Dashboard',
                  href: '/portal/dashboard',
                  show: 'everywhere',
                  type: NavigationElementType.Single,
                } as const,
              ]
            : []),
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
