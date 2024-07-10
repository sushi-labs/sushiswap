'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { IconButton, classNames } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

function Input({
  className,
  placeholder,
  value,
  setValue,
  navigate,
}: {
  className: string
  placeholder: string
  value: string
  setValue: (value: string) => void
  navigate: () => void
}) {
  return (
    <input
      className={classNames(
        className,
        'w-full truncate bg-transparent md:text-lg border-none focus:ring-0',
        'placeholder:text-slate-400 placeholder:font-normal font-medium',
      )}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          navigate?.()
        }
      }}
    />
  )
}

export function SearchBox() {
  const [value, setValue] = useState<string>('')
  const router = useRouter()

  const navigate = useCallback(() => {
    router.push(`/academy/explore?search=${value}`)
  }, [router, value])

  return (
    <div
      className={classNames(
        'bg-slate-800',
        'z-10 flex w-full h-[56px] sm:h-16 px-4 sticky sm:relative top-[54px] sm:top-[unset]',
        'rounded-full flex items-center',
      )}
    >
      <>
        <Input
          className="block md:hidden"
          placeholder="Search"
          value={value}
          setValue={setValue}
          navigate={navigate}
        />
        <Input
          className="md:block hidden"
          placeholder="Search for the product/topic you want to learn about"
          value={value}
          setValue={setValue}
          navigate={navigate}
        />
      </>
      <IconButton
        type="submit"
        className="bg-[#3B7EF6] rounded-full order-2 ml-2 p-2.5"
        icon={MagnifyingGlassIcon}
        iconProps={{
          className: 'fill-white',
        }}
        name="Search"
        onClick={navigate}
      />
    </div>
  )
}
