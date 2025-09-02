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
        <Button
          asChild
          variant="secondary"
          className="rounded-full bg-[#3D657C0A] dark:bg-gray-800 !whitespace-normal !h-auto"
        >
          <a className="flex items-center gap-2.5" href={href}>
            <span className="font-medium text-gray-700 text-sm tracking-tight dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] dark:bg-clip-text dark:text-transparent">
              {buttonText}
            </span>
            <div className="shrink-0 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#22485D] dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9]">
              <ArrowRightIcon className="h-3 w-3 text-gray-100 dark:text-gray-900" />
            </div>
          </a>
        </Button>
      </div>
    </div>
  )
}
