import Typography from 'app/components/Typography'
import { classNames } from 'app/functions'
import Image from 'next/image'
import React from 'react'

export default function Option({
  id,
  link = null,
  onClick = null,
  header,
  subheader = null,
  icon,
  active = false,
  clickable = true,
}: {
  id: string
  link?: string | null
  size?: number | null
  onClick?: null | (() => void)
  header: React.ReactNode
  subheader: React.ReactNode | null
  icon: string
  active?: boolean
  clickable?: boolean
}) {
  const content = (
    <div
      role="button"
      // @ts-ignore TYPE NEEDS FIXING
      onClick={onClick}
      className={classNames(
        clickable ? 'cursor-pointer' : '',
        'bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 justify-between w-full px-4 py-3 rounded border border-dark-700 hover:border-blue'
      )}
    >
      <div className="flex flex-col gap-1">
        <div id={`wallet-option-${header}`} className="flex items-center">
          <Typography variant="sm" weight={700} className="text-high-emphesis">
            {header}
          </Typography>
        </div>
        {subheader && <Typography variant="xs">{subheader}</Typography>}
      </div>
      <Image src={icon} alt={'Icon'} width="32px" height="32px" />
    </div>
  )

  if (link) {
    return <a href={link}>{content}</a>
  }

  return content
}
