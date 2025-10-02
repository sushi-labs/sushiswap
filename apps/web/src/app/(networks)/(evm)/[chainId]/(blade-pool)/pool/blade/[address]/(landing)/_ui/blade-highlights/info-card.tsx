'use client'

import { CheckCircleIcon } from '@heroicons/react-v1/solid'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  classNames,
} from '@sushiswap/ui'
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
      <Card className="relative z-10 border-gray-100 bg-white dark:border-[rgba(255,255,255,0.04)] dark:bg-[#111729]">
        <CardHeader>
          <div className="flex items-center justify-center gap-2.5">
            <CheckCircleIcon className="h-6 w-6 shrink-0 text-[#1AC87F]" />
            <CardTitle className="text-center text-black dark:text-white">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="items-center">
          <p className="text-center text-base font-normal text-[#6c737f] dark:text-[#98a3b6]">
            {description}
          </p>
        </CardContent>
        <CardFooter className="justify-center">
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
              <span className="font-medium text-gray-700 text-sm tracking-tight dark:bg-gradient-to-r dark:from-[#B5E8FC] dark:to-[#D7A8E9] dark:bg-clip-text dark:text-transparent">
                {buttonText}
              </span>
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
