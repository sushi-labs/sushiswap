import { NextSeo } from 'next-seo'
import { Layout } from '../components'
import { RadioGroup, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import { classNames } from '@sushiswap/ui'
import { shortenAddress } from '@sushiswap/format'
import { SushiIcon } from '@sushiswap/ui/future/components/icons'
import { ChainId } from '@sushiswap/chain'
import { useAccount, useEnsName } from '@sushiswap/wagmi'
import { Button } from '@sushiswap/ui/future/components/button'
import { SplashController } from '@sushiswap/ui/future/components/SplashController'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/iconbutton'
import { ArrowLeftIcon } from '@heroicons/react/solid'

enum Type {
  stream,
  vesting,
}

export default function CreatePage() {
  const { address } = useAccount()
  const [type, setType] = useState<Type>(Type.stream)

  const { data: ens } = useEnsName({
    address,
    chainId: ChainId.ETHEREUM,
  })

  return (
    <SplashController>
      <NextSeo title="Create" />
      <Layout maxWidth="4xl">
        <Link
          className="group flex gap-4 items-center mb-2"
          href={{
            pathname: '/',
          }}
          shallow={true}
        >
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
            name="Back"
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">Go back</span>
        </Link>
        <h1 className="text-3xl lg:text-5xl font-semibold max-w-[600px] mt-6">
          Would you like to create a stream or a vest?
        </h1>
        <RadioGroup
          value={type}
          onChange={setType}
          className="flex flex-col lg:flex-row gap-4 lg:gap-10 mt-10 lg:mt-16"
        >
          <RadioGroup.Option value={Type.stream}>
            {({ checked }) => (
              <>
                <div
                  className={classNames(
                    checked ? 'z-10 lg:scale-110 shadow-2xl' : 'lg:scale-100 shadow-md',
                    'relative transform-all duration-200 w-full lg:w-[460px] h-fit lg:h-[290px] bg-gradient-to-tr from-blue to-pink flex flex-col bg-slate-800 p-4 rounded-2xl'
                  )}
                >
                  <div className="relative lg:absolute lg:top-4 lg:left-5 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Stream.</h1>
                    <span className="text-lg font-medium text-gray-50">Stream any ERC20 linearly over time.</span>
                  </div>
                  <div className="absolute hidden lg:flex items-center justify-center gap-3 bottom-4 right-4">
                    <div className="p-2 rounded-full shadow-md bg-white/10">
                      <SushiIcon width={22} height={22} />
                    </div>
                    <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                      Sushi <span className="font-bold">Pay</span>
                    </span>
                  </div>
                  {address && (
                    <div className="absolute hidden lg:flex flex-col text-lg font-semibold tracking-wide text-white left-5 bottom-4 text-sh mono">
                      <span className="text-sm font-medium">Sender</span>
                      {ens ? ens : shortenAddress(address)}
                    </div>
                  )}

                  <div className="absolute bottom-[-70px] lg:bottom-[-80px] left-0 right-0 justify-center flex gap-2">
                    <Transition
                      appear
                      show={checked}
                      enter="transition duration-200 ease-out"
                      enterFrom="transform translate-y-[32px] opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition duration-200 ease-out"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform translate-y-[32px] opacity-0"
                    >
                      <div className="flex justify-center gap-2">
                        <Button as="a" href="/furo/stream/create/single" size="lg" className="!rounded-full">
                          Single stream
                        </Button>
                        <Button as="a" href="/furo/stream/create/multiple" size="lg" className="!rounded-full">
                          Multiple streams
                        </Button>
                      </div>
                    </Transition>
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value={Type.vesting}>
            {({ checked }) => (
              <>
                <div
                  className={classNames(
                    checked ? 'z-10 lg:scale-110 shadow-2xl' : 'lg:scale-100 shadow-md lg:mt-0 mt-20',
                    'relative transform-all duration-200 w-full lg:w-[460px] h-fit lg:h-[290px] bg-gradient-to-tr from-green to-blue flex flex-col bg-slate-800 p-4 rounded-2xl'
                  )}
                >
                  <div className="relative lg:absolute lg:top-4 lg:left-5 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Vest.</h1>
                    <span className="text-lg font-medium text-gray-50">
                      For when you need to unlock funds in chunks.
                    </span>
                  </div>
                  <div className="absolute hidden lg:flex items-center justify-center gap-3 bottom-4 right-4">
                    <div className="p-2 rounded-full shadow-md bg-white/10">
                      <SushiIcon width={22} height={22} />
                    </div>
                    <span className="text-2xl font-medium tracking-[-0.025em] text-white">
                      Sushi <span className="font-bold">Pay</span>
                    </span>
                  </div>
                  {address && (
                    <div className="absolute hidden lg:flex flex-col text-lg font-semibold tracking-wide text-white left-5 bottom-4 text-sh mono">
                      <span className="text-sm font-medium">Sender</span>
                      {ens ? ens : shortenAddress(address)}
                    </div>
                  )}

                  <div className="absolute bottom-[-70px] lg:bottom-[-80px] left-0 right-0 justify-center flex gap-2">
                    <Transition
                      appear
                      show={checked}
                      enter="transition duration-200 ease-out"
                      enterFrom="transform translate-y-[32px] opacity-0"
                      enterTo="transform translate-y-0 opacity-100"
                      leave="transition duration-200 ease-out"
                      leaveFrom="transform translate-y-0 opacity-100"
                      leaveTo="transform translate-y-[32px] opacity-0"
                    >
                      <div className="flex justify-center gap-2">
                        <Button as="a" href="/furo/vesting/create/single" size="lg" className="!rounded-full">
                          Single vest
                        </Button>
                        <Button as="a" href="/furo/vesting/create/multiple" size="lg" className="!rounded-full">
                          Multiple vests
                        </Button>
                      </div>
                    </Transition>
                  </div>
                </div>
              </>
            )}
          </RadioGroup.Option>
        </RadioGroup>
      </Layout>
    </SplashController>
  )
}
