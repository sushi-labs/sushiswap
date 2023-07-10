'use client'
import { ArrowLeftIcon } from '@heroicons/react/20/solid'
import { NetworkIcon } from '@sushiswap/ui'
import { Badge } from '@sushiswap/ui/future/components/Badge'
import Container from '@sushiswap/ui/future/components/Container'
import { IconButton } from '@sushiswap/ui/future/components/IconButton'
import { List } from '@sushiswap/ui/future/components/list/List'
import { PoolPageV3 } from 'components/PoolPageV2'
import { SelectFeeConcentratedWidget } from 'components/SelectFeeConcentratedWidget'
import { SelectNetworkWidget } from 'components/SelectNetworkWidget'
import { SelectPricesWidget } from 'components/SelectPricesWidget'
import { SelectTokensWidget } from 'components/SelectTokensWidget'
import Link from 'next/link'
import React, { FC } from 'react'

export function AddPage() {
  return (
    // <>
    //   <div className="w-full max-w-5xl lg:mx-auto px-4 h-full">
    //     <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">
    //       <div className="flex flex-col gap-2">
    //         <a className="group flex gap-4 items-center mb-2" href="/pool">
    //           <button
    //             className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium transition-colors !ring-0 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary hover:bg-muted focus:bg-accent min-h-[36px] h-[36px] px-3 text-sm rounded-xl"
    //             testdata-id="undefined-button"
    //           >
    //             <svg
    //               xmlns="http://www.w3.org/2000/svg"
    //               viewBox="0 0 20 20"
    //               fill="currentColor"
    //               aria-hidden="true"
    //               className="w-[18px] h-[18px]"
    //             >
    //               <path
    //                 fill-rule="evenodd"
    //                 d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
    //                 clip-rule="evenodd"
    //               ></path>
    //             </svg>
    //             <span className="sr-only">Back</span>
    //           </button>
    //           <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
    //             Go back to pools list
    //           </span>
    //         </a>
    //         <h1 className="text-3xl font-medium mt-2">Add Liquidity</h1>
    //         <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
    //           Create a new pool or create a liquidity position on an existing pool.
    //         </h1>
    //       </div>
    //       <div className="h-0.5 w-full bg-gray-900/5 dark:bg-slate-200/5 my-10"></div>
    //       <div className="flex justify-center">
    //         <div className="hidden lg:block">
    //           <div className="lg:grid grid-cols-2 items-center gap-6 sticky top-[96px]">
    //             <div className="col-span-2 flex gap-7">
    //               <div className="flex min-w-[44px] mb-4">
    //                 <div className="relative">
    //                   <div className="border-2 border-gray-100 dark:border-slate-900 rounded-full z-[11] !bottom-0 right-[-15%] absolute z-10 -right-[25%] -bottom-[15%]">
    //                     <svg
    //                       viewBox="0 0 128 128"
    //                       fill="none"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       width="24"
    //                       height="24"
    //                     ></svg>
    //                   </div>
    //                 </div>
    //               </div>
    //               <div className="col-span-2 flex flex-col gap-2">
    //                 <span className="!px-0 flex justify-start text-xs font-medium text-gray-500 dark:text-slate-400 px-2">
    //                   Network
    //                 </span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <Container maxWidth={'5xl'} className="flex justify-center lg:mx-auto px-4 h-full">
        <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">
          <div className="flex flex-col gap-2">
            <Link className="group flex gap-4 items-center mb-2" href="/" shallow={true}>
              <IconButton
                icon={ArrowLeftIcon}
                iconProps={{
                  width: 24,
                  height: 24,
                  transparent: true,
                }}
              />
              <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
                Go back to pools list
              </span>
            </Link>
            <h1 className="text-3xl font-medium mt-2">Add Liquidity</h1>
            <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
              Create a new pool or create a liquidity position on an existing pool.
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
            <div className="hidden md:block"></div>
            <_Add />
          </div>
        </div>
      </Container>
    </>
  )
}

const _Add: FC = () => {
  return (
    <>
      {/* <div className="hidden lg:block"> */}
      {/* <div className="lg:grid grid-cols-2 items-center gap-6 sticky top-[96px]"> */}
      {/* <div className="col-span-2 flex gap-7">
            <div className="flex min-w-[44px] mb-4"></div>
          </div> */}
      {/* <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Network</List.Label>
            <div className="flex font-medium items-center gap-2 rounded-xl">
              
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Fee Tier</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl ">% Fee</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Pool Type</List.Label>
            <div className="flex items-center font-medium gap-2 rounded-xl">Concentrated Liquidity</div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <List.Label className="!px-0">Current Price</List.Label>
          </div> */}
      {/* </div> */}
      {/* </div> */}
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <SelectNetworkWidget />
        <SelectFeeConcentratedWidget />
        <SelectPricesWidget />
        <SelectTokensWidget />
        <PoolPageV3 />
      </div>
    </>
  )
}

export default AddPage
