'use client'

import { Tab } from '@headlessui/react'
import React from 'react'

export function TabPanel({ children }: { children?: React.ReactNode }) {
  return <Tab.Panel>{children}</Tab.Panel>
}
