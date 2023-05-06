'use client'

import { Tab } from '@headlessui/react'
import React, { ReactNode } from 'react'

export function TabGroup({ children }: { children?: ReactNode }) {
  return <Tab.Group>{children}</Tab.Group>
}
