import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { Button, classNames, Link, Typography } from '@sushiswap/ui'
import { DocsIcon } from 'common/icons'
import { FC } from 'react'

interface ProductTechnicalDoc {
  color: string
  secondaryColor: string
  url: string
}

const DocsButton: FC<{ className: string; url: string }> = ({ className, url }) => (
  <Link.External href={url}>
    <Button className={classNames('w-12 h-12 ml-6', className)} variant="outlined">
      <ArrowRightIcon width={20} height={20} />
    </Button>
  </Link.External>
)

export const ProductTechnicalDoc: FC<ProductTechnicalDoc> = ({ color, secondaryColor, url }) => {
  return (
    <div className="py-10 sm:py-[75px]">
      <div className="flex items-center p-6 sm:p-10 rounded-3xl bg-slate-800">
        <div className="hidden sm:block">
          <DocsIcon color={color} secondaryColor={secondaryColor} />
        </div>
        <div className="sm:ml-8">
          <div className="flex items-center justify-between">
            <Typography variant="lg">Technical Documentation</Typography>
            <DocsButton className="sm:hidden" url={url} />
          </div>
          <Typography variant="sm" className="mt-3 text-slate-400">
            {
              "Learn about the architecture of Sushi's smart contracts and how to build on top of the protocol, you can find implementations and explanations for each of our core smart contracts, broken out by product."
            }
          </Typography>
        </div>
        <DocsButton className="hidden sm:block" url={url} />
      </div>
    </div>
  )
}
