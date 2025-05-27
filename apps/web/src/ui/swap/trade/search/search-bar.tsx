import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useBreakpoint } from '@sushiswap/hooks'
import { Button, TextField, classNames } from '@sushiswap/ui'

export const SearchBar = () => {
  const { isMd } = useBreakpoint('md')
  return (
    <div>
      {!isMd ? (
        <Button variant="ghost" size="sm" className="block md:hidden">
          <MagnifyingGlassIcon width={20} height={20} />
        </Button>
      ) : (
        <TextField
          icon={MagnifyingGlassIcon}
          iconProps={{ widths: 15 }}
          type="text"
          variant="naked"
          placeholder="Search by name or address"
          className={classNames(
            'px-4 placeholder:text-[#7B7A87] !hidden md:!block !dark:text-[#ABA5B0] placeholder:dark:text-[#7B7A87] rounded-lg py-1 w-full dark:!bg-slate-900 !bg-gray-100',
          )}
        />
      )}
    </div>
  )
}
