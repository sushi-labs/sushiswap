import { NextSeo } from 'next-seo'

import { Dashboard } from '../components'

export default function DashboardPage() {
  return (
    <>
      <NextSeo title="Dashboard" />
      <Dashboard />
    </>
  )
}
