import { LinkIcon } from '@heroicons/react/24/outline'
import { Button, Link, Typography } from '@sushiswap/ui'
import { FC } from 'react'

interface ProductHero {
  title: string
  subtitle: string
  url: string
  buttonText: string
}
export const ProductHero: FC<ProductHero> = ({ title, subtitle, url, buttonText }) => {
  return (
    <section className="flex flex-col items-center">
      <Typography variant="hero" weight={700}>
        {title}
      </Typography>
      <Typography variant="h3" weight={500} className="text-gray-500">
        {subtitle}
      </Typography>
      <Link.External href={url} className="hover:text-black">
        <Button
          color="pink"
          size="lg"
          className="mt-16 rounded-full"
          startIcon={<LinkIcon width={20} height={20} stroke="black" />}
        >
          <Typography weight={700} className="text-black">
            {buttonText}
          </Typography>
        </Button>
      </Link.External>
    </section>
  )
}
