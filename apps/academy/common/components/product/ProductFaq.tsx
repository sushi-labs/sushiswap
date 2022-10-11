import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Typography } from '@sushiswap/ui'
import classNames from 'classnames'
import { FC, ReactNode } from 'react'

interface ProductFaq {
  faq: { question: string; answer: ReactNode }[]
}

export const ProductFaq: FC<ProductFaq> = ({ faq }) => {
  return (
    <section className="mt-44">
      <Typography variant="h1">FAQs</Typography>
      <Typography variant="sm">Checkout our how-to articles and Video Tutorials</Typography>
      <div className="mt-16 border-2 divide-y rounded-3xl border-slate-500/30 divide-slate-500">
        {faq.map(({ question, answer }, i) => (
          <Disclosure key={i} as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full p-9">
                  <Typography variant="lg">{question}</Typography>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700/60">
                    <ChevronDownIcon
                      strokeWidth={4}
                      width={12}
                      height={12}
                      className={classNames('transition', open && 'transform rotate-180')}
                    />
                  </div>
                </Disclosure.Button>

                <Transition
                  className="transition-[max-height] overflow-hidden"
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-[380px]"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-[380px]"
                  leaveTo="transform max-h-0"
                >
                  <Disclosure.Panel className="text-gray-500 px-9 pb-9">{answer}</Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  )
}
