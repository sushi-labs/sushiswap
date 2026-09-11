import type { Meta, StoryObj } from '@storybook/react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@sushiswap/ui'

const meta = {
  title: 'Primitives/NavigationMenu',
  component: NavigationMenu,
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default = {
  args: { defaultValue: 'earn' },
  render: (args) => (
    <div className="min-h-80">
      <NavigationMenu {...args}>
        <NavigationMenuList>
          <NavigationMenuItem value="earn">
            <NavigationMenuTrigger>Earn</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-72 gap-4 p-6">
                <NavigationMenuLink href="/pool">
                  Liquidity pools
                </NavigationMenuLink>
                <NavigationMenuLink href="/positions">
                  Your positions
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/swap" className="p-4">
              Swap
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
} satisfies Story
export const Closed = { ...Default, args: { defaultValue: '' } } satisfies Story
