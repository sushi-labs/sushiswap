import { ChevronDownIcon } from '@heroicons/react/solid'
import { App, AppType, Button, Link, Menu } from '@sushiswap/ui'
import React, { FC } from 'react'
export const Header: FC = () => {
  return (
    <App.Header withScrollBackground={true} appType={AppType.Root}>
      <div className="flex items-center gap-2">
        <div className="items-center hidden gap-2 md:flex">
          <Link.Internal href="/blog" passHref={true}>
            <Button as="a" variant="empty" color="gray">
              Blog
            </Button>
          </Link.Internal>
          <Menu
            button={
              <Menu.Button variant="empty" color="gray" endIcon={<ChevronDownIcon width={16} height={16} />}>
                Governance
              </Menu.Button>
            }
          >
            <Menu.Items>
              <Link.External href="https://forum.sushi.com" className="!no-underline">
                <Menu.Item>Forum & Proposals</Menu.Item>
              </Link.External>
              <Link.External href="https://snapshot.org/#/sushigov.eth" className="!no-underline">
                <Menu.Item as="a">Vote</Menu.Item>
              </Link.External>
            </Menu.Items>
          </Menu>
        </div>
        <Link.Internal href="/swap" passHref={true}>
          <Button as="a" size="sm" className="ml-4 whitespace-nowrap">
            Enter App
          </Button>
        </Link.Internal>
      </div>
    </App.Header>
  )
}
