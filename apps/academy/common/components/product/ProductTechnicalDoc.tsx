import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { LinkExternal, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { DocsIcon } from 'common/icons'
import { FC } from 'react'

interface ProductTechnicalDoc {
  color: string
  secondaryColor: string
  url: string
}

const DocsButton: FC<{ className: string; url: string }> = ({
  className,
  url,
}) => (
  <LinkExternal href={url}>
    <Button className={classNames(className)} variant="secondary">
      <ArrowRightIcon width={20} height={20} />
    </Button>
  </LinkExternal>
)

export const ProductTechnicalDoc: FC<ProductTechnicalDoc> = ({
  color,
  secondaryColor,
  url,
}) => {
  return (
    <div className="py-10 sm:py-[75px]">
      <div className="flex items-center p-6 sm:p-10 rounded-3xl bg-slate-800">
        <div className="hidden sm:block">
          <DocsIcon color={color} secondaryColor={secondaryColor} />
        </div>
        <div className="sm:ml-8">
          <div className="flex items-center justify-between">
            <span className="text-lg">Technical Documentation</span>
            <DocsButton className="sm:hidden" url={url} />
          </div>
          <span className="text-sm mt-3 text-slate-400">
            {
              "Learn about the architecture of Sushi's smart contracts and how to build on top of the protocol, you can find implementations and explanations for each of our core smart contracts, broken out by product."
            }
          </span>
        </div>
        <DocsButton className="hidden sm:block" url={url} />
      </div>
    </div>
  )
}
