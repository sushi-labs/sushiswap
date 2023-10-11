// List.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react'
import { DiscordIcon, List } from '@sushiswap/ui'
import * as React from 'react'

const meta = {
  title: 'Primitives/List',
  component: List,
  parameters: {
    docs: {
      page: null,
    },
    controls: { expanded: true },
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof List>

export const StandardList = {
  name: 'List with standard items',
  args: {
    children: 'List',
  },
  render: () => {
    return (
      <List>
        <List.Label>Label</List.Label>
        <List.Control>
          <List.Item
            icon={DiscordIcon}
            iconProps={{ width: 20, height: 20 }}
            title="List item 1"
          >
            Value item 1
          </List.Item>
          <List.Item
            icon={DiscordIcon}
            iconProps={{ width: 20, height: 20 }}
            title="List item 2"
            subtitle="List item 2 subtitle"
          />
        </List.Control>
      </List>
    )
  },
} satisfies Story

export const KeyValueList = {
  name: 'List with key-value items',
  args: {
    children: 'List',
  },
  render: () => {
    return (
      <List>
        <List.Label>Label</List.Label>
        <List.Control>
          <List.KeyValue title="List item 1">Value item 1</List.KeyValue>
          <List.KeyValue title="List item 2">Value item 2</List.KeyValue>
        </List.Control>
      </List>
    )
  },
} satisfies Story

export const MenuItemList = {
  name: 'List with menu items',
  args: {
    children: 'List',
  },
  render: () => {
    return (
      <List>
        <List.Label>Label</List.Label>
        <List.Control>
          <List.MenuItem
            title="Hover me to see a custom icon"
            hoverIcon={DiscordIcon}
          />
          <List.MenuItem title="Hover me" />
        </List.Control>
      </List>
    )
  },
} satisfies Story
