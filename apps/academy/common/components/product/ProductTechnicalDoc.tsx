import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { Button, Link, Typography } from '@sushiswap/ui'
import { docsUrl } from 'common/helpers'
import { DocsIcon } from 'common/icons'
import { FC } from 'react'

interface ProductTechnicalDoc {
  color: string
  secondaryColor: string
}
export const ProductTechnicalDoc: FC<ProductTechnicalDoc> = ({ color, secondaryColor }) => {
  return (
    <div className="py-[75px]">
      <div className="flex items-center p-6 sm:p-10 rounded-3xl bg-slate-800">
        <div className="hidden sm:block">
          <DocsIcon color={color} secondaryColor={secondaryColor} />
        </div>
        <div className="sm:ml-8">
          <Typography variant="lg">Technical Documentation</Typography>
          <Typography variant="sm" className="mt-3 text-gray-500">
            The IPool interface was developed by the Sushi team in the process of building. The IPool interface was
            developed by the Sushi team in the process of building.
          </Typography>
        </div>
        <Link.External href={docsUrl}>
          <Button className="w-12 h-12 ml-6" variant="outlined">
            <ArrowRightIcon width={20} height={20} />
          </Button>
        </Link.External>
      </div>
    </div>
  )
}
