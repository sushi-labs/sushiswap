'use client'

import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { classNames } from '@sushiswap/ui'
import { ProductSectionTitle } from './product-section-title'

import { faq as bentoboxFaq } from '../bentobox/bentobox-data'
import { faq as furoFaq } from '../furo/furo-data'
import { faq as onsenFaq } from '../onsen/onsen-data'
import { faq as sushixswapFaq } from '../sushixswap/sushixswap-data'

const faqMap = {
  furo: furoFaq,
  onsen: onsenFaq,
  sushixswap: bentoboxFaq,
  bentobox: sushixswapFaq,
} as const

interface ProductFaq {
  faqSlug: keyof typeof faqMap
}

export function ProductFaq({ faqSlug }: ProductFaq) {
  const faq = faqMap[faqSlug]

  return (
    <section className="py-10 sm:py-[75px]">
      <ProductSectionTitle title="FAQs" subtitle="Frequently asked questions" />
      <div className="mt-8 sm:mt-16 border-2 divide-y-2 rounded-3xl border-slate-500/30 divide-slate-500/30">
        {faq.map(({ question, answer }, i) => (
          <Disclosure key={i} as="div">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full p-6 sm:p-9">
                  <p className="text-lg text-left">{question}</p>
                  <div className="flex items-center justify-center h-6 rounded-full bg-slate-700/60 ml-2 min-w-[24px]">
                    <ChevronDownIcon
                      strokeWidth={4}
                      width={12}
                      height={12}
                      className={classNames(
                        'transition',
                        open && 'transform rotate-180',
                      )}
                    />
                  </div>
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="duration-300 ease-in-out"
                  enterFrom="transform max-h-0"
                  enterTo="transform max-h-max"
                  leave="transition-[max-height] duration-250 ease-in-out"
                  leaveFrom="transform max-h-max"
                  leaveTo="transform max-h-0"
                >
                  <div className="transition-[max-height] overflow-hidden">
                    <Disclosure.Panel className="px-6 pb-6 text-slate-400 sm:px-9 sm:pb-9 sm:text-base">
                      {answer}
                    </Disclosure.Panel>
                  </div>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  )
}
