'use client'

import { CheckCircleIcon } from '@heroicons/react-v1/solid'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button, classNames } from '@sushiswap/ui'
import type { FC } from 'react'

interface InfoCardProps {
  title: string
  description: string
  buttonText: string
  href: string
  glowClassName?: string
}

export const InfoCard: FC<InfoCardProps> = ({
  title,
  description,
  buttonText,
  href,
  glowClassName,
}) => {
  return (
    <div className="relative">
      <div
        className={classNames(
          'absolute inset-[24px] opacity-20 rounded-full blur-[100px]',
          glowClassName,
        )}
      />
      <div className="relative z-10 flex flex-col items-center rounded-xl border border-gray-100 bg-white px-6 py-10 dark:border-[rgba(255,255,255,0.04)] dark:bg-[#111729]">
        <div className="flex items-center justify-center gap-2.5">
          <CheckCircleIcon
            className={classNames('text-[#1AC87F] h-6 w-6 shrink-0')}
          />
          <h3 className="text-center text-lg font-bold text-black dark:text-white">
            {title}
          </h3>
        </div>
        <p className="max-w-[400px] text-center text-base font-normal text-[#6c737f] dark:text-[#98a3b6] mt-6 mb-10">
          {description}
        </p>
        <a href={href}>
          <Button
            variant="secondary"
            icon={ArrowRightIcon}
            className="!h-auto !whitespace-normal"
            iconProps={{
              className:
                'h-[22px] w-[22px] p-1 rounded-full bg-[#22485D] dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] text-gray-100 dark:text-gray-900 shrink-0',
            }}
            iconPosition="end"
            asChild
          >
            {buttonText}
          </Button>
        </a>
      </div>
    </div>
  )
}
