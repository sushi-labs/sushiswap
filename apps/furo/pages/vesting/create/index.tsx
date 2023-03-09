import { Breadcrumb, BreadcrumbLink, Button, Typography } from '@sushiswap/ui'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { Layout } from '../../../components'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/vesting/create',
    label: 'Create Vesting',
  },
]

const VestingCreate = () => {
  return (
    <>
      <NextSeo title="New Vesting" />
      <Layout>
        <Breadcrumb home="/dashboard" links={LINKS} />
        <div className="mt-24">
          <div className="flex flex-col justify-center gap-20">
            <Typography variant="h2" weight={500} className="text-center">
              How many vests would you like to create?
            </Typography>
            <div className="flex justify-center gap-20">
              <Link href="/vesting/create/single" passHref={true} legacyBehavior>
                <a className="flex flex-col items-center gap-7">
                  <div className="w-[86px] h-[86px] bg-slate-600 group-hover:bg-blue rounded-lg" />
                  <Button size="sm">One</Button>
                </a>
              </Link>
              <Link href="/vesting/create/multiple" passHref={true} legacyBehavior>
                <a className="flex flex-col items-center gap-7">
                  <div className="w-[86px] h-[86px] group-hover:bg-blue rounded-lg">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-[41px] h-[41px] bg-slate-600 group-hover:bg-blue rounded-md" />
                      <div className="w-[41px] h-[41px] bg-slate-600 group-hover:bg-blue rounded-md" />
                      <div className="w-[41px] h-[41px] bg-slate-600 group-hover:bg-blue rounded-md" />
                      <div className="w-[41px] h-[41px] bg-slate-600 group-hover:bg-blue rounded-md" />
                    </div>
                  </div>
                  <Button size="sm">Multiple</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default VestingCreate
