'use client'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { AppearOnMount, Container, Link, Typography } from '@sushiswap/ui'
import { AddSectionMyPosition } from 'components/AddSection/AddSectionMyPosition'
import { AddSectionStake } from 'components/AddSection/AddSectionStake'
import { Layout } from 'components/Layout'
import { FC } from 'react'

const LINKS = () => [
  {
    href: ``,
    label: ``,
  },
  {
    href: ``,
    label: ``,
  },
]

const Add: FC = ({}) => {
  return <_Add />
}

const _Add = () => {
  return (
    <>
      <Layout>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
            <AddSectionStake />
            <Container className="flex justify-center">
              <Link.External
                href="https://docs.sushi.com/docs/Products/Sushiswap/Liquidity%20Pools"
                className="flex justify-center px-6 py-4 dark:decoration-slate-500 decoration-gray-500 hover:bg-opacity-[0.06] cursor-pointer rounded-2xl"
              >
                <Typography
                  variant="xs"
                  weight={500}
                  className="flex items-center gap-1 text-gray-600 dark:text-slate-500"
                >
                  Learn more about liquidity and yield farming
                  <ArrowTopRightOnSquareIcon height={20} width={20} />
                </Typography>
              </Link.External>
            </Container>
          </div>
          <div className="order-1 sm:order-3">
            <AppearOnMount>
              <AddSectionMyPosition />
            </AppearOnMount>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Add
