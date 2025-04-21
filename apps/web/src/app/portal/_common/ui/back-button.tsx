'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { classNames } from '@sushiswap/ui'
import { useRouter } from 'nextjs-toploader/app'

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()

  return (
    <div
      onClick={router.back}
      onKeyUp={router.back}
      className={classNames(
        className,
        'cursor-pointer text-blue-500 hover:text-blue-600 focus:text-blue-600 flex flex-row items-center space-x-2',
      )}
    >
      <ArrowLeftIcon width={20} height={20} />
      <span className="font-semibold">Back</span>
    </div>
  )
}
