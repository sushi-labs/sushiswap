'use client'

import { Tab } from '@headlessui/react'
import React from 'react'

export function TabPanels({ children }: { children?: React.ReactNode }) {
  return <Tab.Panels>{children}</Tab.Panels>
}
