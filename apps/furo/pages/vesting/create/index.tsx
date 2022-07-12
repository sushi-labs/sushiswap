import { Typography } from '@sushiswap/ui'
import { Breadcrumb, BreadcrumbLink, Layout } from 'components'
import Link from 'next/link'

const LINKS: BreadcrumbLink[] = [
  {
    href: '/vesting/create',
    label: 'Create Vesting',
  },
]

const VestingCreate = () => {
  return (
    <Layout>
      <Breadcrumb links={LINKS} />
      <div className="mt-24">
        <div className="flex flex-col gap-10 justify-center">
          <Typography variant="h3" weight={500} className="text-center">
            How many vestings would you like to create?
          </Typography>
          <div className="flex gap-10 justify-center">
            <Link href="/vesting/create/single" passHref={true}>
              <a>
                <button className="pt-[74px] relative cursor-pointer transition-all hover:scale-[1.02] group flex flex-col gap-10 items-center w-[240px] h-[280px] bg-slate-800 rounded-md hover:shadow-xl hover:shadow-blue-900/30">
                  <div className="w-[56px] h-[56px] bg-blue-600 group-hover:bg-blue rounded-md" />
                  <Typography
                    weight={500}
                    className="absolute bottom-[60px] left-0 right-0 text-center text-slate-400 group-hover:text-slate-200"
                  >
                    One
                  </Typography>
                </button>
              </a>
            </Link>
            <Link href="/vesting/create/multiple" passHref={true}>
              <a>
                <button className="pt-[60px] relative cursor-pointer transition-all hover:scale-[1.02] group flex flex-col gap-10 items-center  w-[240px] h-[280px] bg-slate-800 rounded-md hover:shadow-xl hover:shadow-blue-900/30">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="w-[40px] h-[40px] bg-blue-600 group-hover:bg-blue rounded-md" />
                    <div className="w-[40px] h-[40px] bg-blue-600 group-hover:bg-blue rounded-md" />
                    <div className="w-[40px] h-[40px] bg-blue-600 group-hover:bg-blue rounded-md" />
                    <div className="w-[40px] h-[40px] bg-blue-600 group-hover:bg-blue rounded-md" />
                  </div>
                  <Typography
                    weight={500}
                    className="absolute bottom-[60px] left-0 right-0 text-center text-slate-400 group-hover:text-slate-200"
                  >
                    Multiple
                  </Typography>
                </button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VestingCreate
