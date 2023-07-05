import { Currency, DEFAULT_INPUT_UNSTYLED, NetworkIcon, Skeleton, Typography, classNames } from '@sushiswap/ui'
import React, {
  FC,
  KeyboardEvent,
  ReactElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
// import { SearchIcon } from '@heroicons/react-v1/solid'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { useQuery, useToken } from '@sushiswap/wagmi'
import { delimiter } from 'path'
import { Loader } from '@sushiswap/ui/future/components/Loader'
// import { useDebounce, useOnClickOutside } from '@sushiswap/hooks'

// const EXAMPLE_CURRENCIES = [
//   new Token({
//     chainId: ChainId.ETHEREUM,
//     address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
//     decimals: 18,
//     symbol: 'ETH',
//     name: 'Ether',
//   }),
// ]

interface Search {
  className?: string
  id: string
  input?(props: any): ReactElement | null
  value: string
  loading: boolean
  onChange(val: string): void
  size?: 'sm' | 'default'
  delimiter?: string
}

export const Search: FC<Search> = forwardRef<HTMLInputElement, Search>(function Search(
  { className, id, loading, input: Input, value, onChange, size = 'default', delimiter },
  ref
) {
  const [values, setValues] = useState({
    all: value.split(delimiter || ' '),
    typed: '',
  })
  const _onChange = useCallback(
    (val: string) => {
      if (val.slice(-1) === (delimiter || ' ')) {
        setValues((prev) => ({
          typed: '',
          all: [...prev.all, prev.typed],
        }))
      } else {
        setValues((prev) => ({
          typed: val,
          all: prev.all,
        }))
      }
    },
    [delimiter]
  )

  const remove = useCallback((val: string) => {
    setValues((prev) => ({
      typed: prev.typed,
      all: prev.all.filter((_val) => _val !== val),
    }))
  }, [])

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      setValues((prev) => ({
        typed: prev.typed,
        all: prev.all.slice(0, -1),
      }))
    }
    if (event.key === 'Enter') {
      setValues((prev) => ({
        typed: '',
        all: [...prev.all, prev.typed],
      }))
    }
  }, [])

  useEffect(() => {
    if (delimiter) {
      onChange(`${values.typed} ${values.all.filter((el) => el !== ' ' && el !== '').join(' ')}`)
    }
  }, [delimiter, onChange, values])

  if (delimiter) {
    return (
      <div
        className={classNames(
          className,
          size === 'sm' ? 'h-[38px] text-sm px-[8px]' : '',
          '!focus-within:bg-gray-200 relative pr-10 rounded-xl flex gap-2.5 flex-grow items-center bg-black/[0.04] dark:bg-white/[0.04] px-3 py-2.5 h-[44px]'
        )}
      >
        <div className="block" style={{ minWidth: size === 'sm' ? 18 : 24, minHeight: size === 'sm' ? 18 : 24 }}>
          <MagnifyingGlassIcon
            strokeWidth={2}
            width={size === 'sm' ? 18 : 24}
            height={size === 'sm' ? 18 : 24}
            className="text-gray-500 dark:text-slate-500"
          />
        </div>

        <div className="flex gap-1">
          {values.all
            .filter((el) => el !== ' ' && el !== '')
            .map((el, i) => (
              <div
                onClick={() => remove(el)}
                key={i}
                className="font-semibold text-gray-600 dark:text-slate-300 flex items-center text-sm rounded-full p-1 pl-2.5 bg-black/[0.08] dark:bg-white/[0.16] gap-1"
              >
                {el}
                <div className="cursor-pointer hover:bg-black/[0.16] dark:hover:bg-white/[0.24] rounded-full p-0.5">
                  <XMarkIcon strokeWidth={3} width={14} height={14} className="text-gray-600 dark:text-slate-300" />
                </div>
              </div>
            ))}
        </div>
        <input
          id={`${id}-address-input`}
          testdata-id={`${id}-address-input`}
          placeholder="Search"
          value={values.typed}
          onChange={(e) => _onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={classNames(
            'truncate font-semibold w-full bg-transparent !p-0 placeholder:font-medium placeholder:text-gray-400 placeholder:dark:text-slate-500 text-gray-900 dark:text-slate-200'
          )}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        />
        {(loading || value) && (
          <div className="absolute right-3 flex items-center">
            {loading ? (
              <div>
                <Loader size={16} className="text-gray-700 dark:text-slate-500" />
              </div>
            ) : value ? (
              <div
                onClick={() =>
                  setValues({
                    all: [],
                    typed: '',
                  })
                }
              >
                <XMarkIcon width={24} height={24} className="cursor-pointer text-slate-500 hover:text-slate-300" />
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    )
  }
  return (
    <div
      className={classNames(
        className,
        size === 'sm' ? 'h-[38px] text-sm px-[8px]' : '',
        '!focus-within:bg-gray-200 relative pr-10 rounded-xl flex gap-2.5 flex-grow items-center bg-black/[0.04] dark:bg-white/[0.04] px-3 py-2.5 h-[44px]'
      )}
    >
      <MagnifyingGlassIcon
        strokeWidth={2}
        width={size === 'sm' ? 18 : 24}
        height={size === 'sm' ? 18 : 24}
        className="text-gray-500 dark:text-slate-500"
      />
      {Input ? (
        <Input
          ref={ref}
          id={`${id}-address-input`}
          testdata-id={`${id}-address-input`}
          variant="unstyled"
          placeholder="Search"
          value={value}
          onChange={onChange}
          className={classNames(
            'font-medium w-full bg-transparent !p-0 placeholder:font-medium placeholder:text-gray-400 placeholder:dark:text-slate-500 text-gray-900 dark:text-slate-200'
          )}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        />
      ) : (
        <input
          id={`${id}-address-input`}
          testdata-id={`${id}-address-input`}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={classNames(
            'truncate font-semibold w-full bg-transparent !p-0 placeholder:font-medium placeholder:text-gray-400 placeholder:dark:text-slate-500 text-gray-900 dark:text-slate-200'
          )}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="off"
        />
      )}
      {(loading || value) && (
        <div className="absolute right-3 flex items-center">
          {loading ? (
            <div>
              <Loader size={16} className="text-gray-700 dark:text-slate-500" />
            </div>
          ) : value ? (
            <div onClick={() => onChange('')}>
              <XMarkIcon width={24} height={24} className="cursor-pointer text-slate-500 hover:text-slate-300" />
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
})

// export const Search: FC = () => {
//   const ref = useRef<HTMLDivElement>(null)
//   const [query, setQuery] = useState<string>('')
//   // const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM)
//   // const debouncedQuery = useDebounce(query, 500)
//   const [selectNetwork, setSelectNetwork] = useState(false)
//   const [open, setOpen] = useState(false)

//   // useOnClickOutside(ref, () => {
//   //   setOpen(false)
//   //   setSelectNetwork(false)
//   // })

//   // const { data: web3Token, isLoading: web3Loading } = useToken({
//   //   address: query as `0x${string}`,
//   //   chainId,
//   //   enabled: isAddress(query),
//   // })

//   // const { data: tokenList } = useQuery<TokenList>(
//   //   ['https://token-list.sushi.com'],
//   //   () => fetch('https://token-list.sushi.com').then((response) => response.json()),
//   //   {
//   //     enabled: debouncedQuery.length > 2 && !isAddress(debouncedQuery),
//   //   }
//   // )

//   // const filteredTokens = useMemo(() => {
//   //   return tokenList?.tokens?.filter(
//   //     (el) => el.symbol.toLowerCase().includes(debouncedQuery.toLowerCase()) && el.chainId === chainId
//   //   )
//   // }, [chainId, debouncedQuery, tokenList?.tokens])

//   // const skeleton = useMemo(() => {
//   //   // return (
//   //   //   <div className="flex flex-col gap-2">
//   //   //     <div className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-700">
//   //   //       <div className="w-[36px] h-[36px]">
//   //   //         <Skeleton.Circle radius={36} className="bg-neutral-600" />
//   //   //       </div>
//   //   //       <div className="flex flex-col space-y-1">
//   //   //         <Skeleton.Box className="h-4 w-[120px] my-0.5 bg-neutral-600" />
//   //   //         <Skeleton.Box className="h-4 w-[60px] my-0.5 bg-neutral-700" />
//   //   //       </div>
//   //   //     </div>
//   //   //   </div>
//   //   // )
//   // }, [])

//   // useEffect(() => {
//   //   if (selectNetwork) {
//   //     setOpen(true)
//   //   } else {
//   //     setOpen(false)
//   //   }
//   // }, [selectNetwork])

//   // return (
//   //   // <div className="relative flex flex-col gap-3">
//   //   //   <div className="absolute z-10 flex w-full gap-4">
//   //   //     <div className="relative w-full  rounded-xl">
//   //   //       <div className="bg-gray-50 dark:bg-white/[0.02] pt-4">
//   //   //         <div className="w-full max-w-7xl px-4 mx-auto">
//   //   //           <div className="flex flex-col gap-4 mb-4">
//   //   //             <div className="flex gap-4">
//   //   //               <div className="font-medium relative w-full flex items-center gap-1.5 rounded-xl bg-gray-50 dark:bg-white/[0.04] min-h-10 h-10 py-2 px-4 text-sm">
//   //   //                 <svg
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                   width="24"
//   //   //                   height="24"
//   //   //                   viewBox="0 0 24 24"
//   //   //                   fill="none"
//   //   //                   stroke="currentColor"
//   //   //                   stroke-width="2"
//   //   //                   stroke-linecap="round"
//   //   //                   stroke-linejoin="round"
//   //   //                   className="w-5 h-5"
//   //   //                 >
//   //   //                   <circle cx="11" cy="11" r="8"></circle>
//   //   //                   <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
//   //   //                 </svg>
//   //   //                 <div className="flex gap-1"></div>
//   //   //                 <input
//   //   //                   id="search-address-input"
//   //   //                   testdata-id="search-address-input"
//   //   //                   placeholder="Search"
//   //   //                   className="truncate bg-transparent w-full min-h-10 h-10 pr-6"
//   //   //                   autoCorrect="off"
//   //   //                   autoCapitalize="off"
//   //   //                   spellCheck="false"
//   //   //                   autoComplete="off"
//   //   //                   value=""
//   //   //                 />
//   //   //                 <div className="absolute right-3 flex items-center">
//   //   //                   <div>
//   //   //                     <svg
//   //   //                       xmlns="http://www.w3.org/2000/svg"
//   //   //                       fill="none"
//   //   //                       viewBox="0 0 24 24"
//   //   //                       stroke-width="1.5"
//   //   //                       stroke="currentColor"
//   //   //                       aria-hidden="true"
//   //   //                       className="w-5 h-5 cursor-pointer"
//   //   //                     >
//   //   //                       <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
//   //   //                     </svg>
//   //   //                   </div>
//   //   //                 </div>
//   //   //               </div>
//   //   //               <button
//   //   //                 className="cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium transition-colors !ring-0 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary hover:bg-muted focus:bg-accent min-h-[40px] h-[40px] py-2 px-4 text-sm rounded-xl bg-gray-50 dark:bg-white/[0.04]"
//   //   //                 role="combobox"
//   //   //                 aria-expanded="false"
//   //   //                 type="button"
//   //   //                 aria-haspopup="dialog"
//   //   //                 aria-controls="radix-:r5:"
//   //   //                 data-state="closed"
//   //   //                 testdata-id="undefined-button"
//   //   //               >
//   //   //                 <span>Networks</span>
//   //   //                 <svg
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                   fill="none"
//   //   //                   viewBox="0 0 24 24"
//   //   //                   stroke-width="2"
//   //   //                   stroke="currentColor"
//   //   //                   aria-hidden="true"
//   //   //                   width="16"
//   //   //                   height="16"
//   //   //                   className="w-4 h-4"
//   //   //                 >
//   //   //                   <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
//   //   //                 </svg>
//   //   //               </button>
//   //   //             </div>
//   //   //             <div className="flex flex-wrap items-center gap-3">
//   //   //               <div className="flex gap-3 flex-wrap items-center">
//   //   //                 <button
//   //   //                   type="button"
//   //   //                   aria-pressed="false"
//   //   //                   data-state="off"
//   //   //                   testdata-id="undefined-button"
//   //   //                   className="inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground !ring-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground bg-transparent h-9 px-2.5 rounded-xl"
//   //   //                 >
//   //   //                   <span>🍣</span>{' '}
//   //   //                   <span>
//   //   //                     SushiSwap <sup>v3</sup>
//   //   //                   </span>
//   //   //                 </button>
//   //   //                 <button
//   //   //                   type="button"
//   //   //                   aria-pressed="false"
//   //   //                   data-state="off"
//   //   //                   testdata-id="undefined-button"
//   //   //                   className="inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground !ring-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground bg-transparent h-9 px-2.5 rounded-xl"
//   //   //                 >
//   //   //                   <span>🍣</span>{' '}
//   //   //                   <span>
//   //   //                     SushiSwap <sup>v2</sup>
//   //   //                   </span>
//   //   //                 </button>
//   //   //                 <button
//   //   //                   type="button"
//   //   //                   aria-pressed="false"
//   //   //                   data-state="off"
//   //   //                   testdata-id="undefined-button"
//   //   //                   className="inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground !ring-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground bg-transparent h-9 px-2.5 rounded-xl"
//   //   //                 >
//   //   //                   <span className="mt-1">🍱</span>
//   //   //                   <span>Trident Stable</span>
//   //   //                 </button>
//   //   //                 <button
//   //   //                   type="button"
//   //   //                   aria-pressed="false"
//   //   //                   data-state="off"
//   //   //                   testdata-id="undefined-button"
//   //   //                   className="inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground !ring-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground bg-transparent h-9 px-2.5 rounded-xl"
//   //   //                 >
//   //   //                   <span className="mt-1">🍱</span>
//   //   //                   <span>Trident classNameic</span>
//   //   //                 </button>
//   //   //                 <button
//   //   //                   type="button"
//   //   //                   aria-pressed="false"
//   //   //                   data-state="off"
//   //   //                   testdata-id="undefined-button"
//   //   //                   className="inline-flex gap-2 items-center justify-center text-sm font-medium transition-colors data-[state=on]:bg-accent data-[state=on]:text-accent-foreground !ring-0 disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-muted-foreground bg-transparent h-9 px-2.5 rounded-xl"
//   //   //                 >
//   //   //                   <span>🧑‍🌾</span> <span>Farms</span>
//   //   //                 </button>
//   //   //               </div>
//   //   //             </div>
//   //   //           </div>
//   //   //         </div>
//   //   //         <div
//   //   //           id="headlessui-tabs-panel-:r6:"
//   //   //           role="tabpanel"
//   //   //           tabIndex="0"
//   //   //           data-headlessui-state="selected"
//   //   //           aria-labelledby
//   //   //         >
//   //   //           <div className="w-full max-w-7xl px-4 mx-auto">
//   //   //             <div className="infinite-scroll-component__outerdiv">
//   //   //               <div className="infinite-scroll-component" style={{ height: 'auto', overflow: 'auto' }}>
//   //   //                 <div testdata-id="undefined-table-container" className="">
//   //   //                   <div testdata-id="undefined-table" className="overflow-auto scroll z-10">
//   //   //                     <table className="w-full border-collapse">
//   //   //                       <thead
//   //   //                         testdata-id="undefined-thead"
//   //   //                         className="border-b border-gray-200 dark:border-slate-200/5"
//   //   //                       >
//   //   //                         <tr testdata-id="undefined-0-thr" className="w-fulls" style={{ height: '48px' }}>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-0-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="h-full flex items-center gap-2">Name</div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-1-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               TVL
//   //   //                               <svg
//   //   //                                 xmlns="http://www.w3.org/2000/svg"
//   //   //                                 viewBox="0 0 20 20"
//   //   //                                 fill="currentColor"
//   //   //                                 aria-hidden="true"
//   //   //                                 width="14"
//   //   //                                 height="14"
//   //   //                               >
//   //   //                                 <path
//   //   //                                   fill-rule="evenodd"
//   //   //                                   d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
//   //   //                                   clip-rule="evenodd"
//   //   //                                 ></path>
//   //   //                               </svg>
//   //   //                             </div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-2-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               Volume (24h)
//   //   //                             </div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-3-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               Volume (1w)
//   //   //                             </div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-4-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               Volume (1m)
//   //   //                             </div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-5-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               Fees (24h)
//   //   //                             </div>
//   //   //                           </th>
//   //   //                           <th
//   //   //                             colSpan={1}
//   //   //                             testdata-id="undefined-0-6-th"
//   //   //                             className="px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
//   //   //                             style={{ height: '48px' }}
//   //   //                           >
//   //   //                             <div className="cursor-pointer select-none justify-end h-full flex items-center gap-2">
//   //   //                               <div className="flex items-center gap-1">
//   //   //                                 APR
//   //   //                                 <svg
//   //   //                                   xmlns="http://www.w3.org/2000/svg"
//   //   //                                   viewBox="0 0 20 20"
//   //   //                                   fill="currentColor"
//   //   //                                   aria-hidden="true"
//   //   //                                   width="16"
//   //   //                                   height="16"
//   //   //                                   className="self-center text-muted-foreground"
//   //   //                                   data-state="closed"
//   //   //                                 >
//   //   //                                   <path
//   //   //                                     fill-rule="evenodd"
//   //   //                                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
//   //   //                                     clip-rule="evenodd"
//   //   //                                   ></path>
//   //   //                                 </svg>
//   //   //                               </div>
//   //   //                             </div>
//   //   //                           </th>
//   //   //                         </tr>
//   //   //                       </thead>
//   //   //                     </table>
//   //   //                   </div>
//   //   //                 </div>
//   //   //                 <div className="flex justify-center w-full py-4">
//   //   //                   <svg
//   //   //                     className="animate-rotate"
//   //   //                     width="24"
//   //   //                     height="24"
//   //   //                     viewBox="0 0 14 14"
//   //   //                     fill="none"
//   //   //                     xmlns="http://www.w3.org/2000/svg"
//   //   //                   >
//   //   //                     <circle
//   //   //                       cx="7"
//   //   //                       cy="7"
//   //   //                       r="6"
//   //   //                       stroke="currentColor"
//   //   //                       stroke-width="2"
//   //   //                       className="text-gray-400 dark:text-white/[0.12]"
//   //   //                     ></circle>
//   //   //                     <path
//   //   //                       d="M7 1C8.04257 1 9.06714 1.27166 9.97275 1.78821C10.8784 2.30476 11.6337 3.04837 12.1645 3.94575C12.6952 4.84313 12.9829 5.86332 12.9993 6.90576C13.0156 7.9482 12.7601 8.97691 12.2578 9.89052"
//   //   //                       stroke="currentColor"
//   //   //                       stroke-width="2"
//   //   //                       stroke-linecap="round"
//   //   //                       className="text-gray-700 dark:text-white"
//   //   //                     ></path>
//   //   //                   </svg>
//   //   //                 </div>
//   //   //               </div>
//   //   //             </div>
//   //   //           </div>
//   //   //         </div>
//   //   //       </div>
//   //   //       <footer className="bg-gray-100 dark:bg-slate-900 hidden sm:flex flex-col pt-[72px]">
//   //   //         <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4">
//   //   //           <div className="col-span-2">
//   //   //             <div className="text-xs w-full text-gray-600 dark:text-slate-400">
//   //   //               1. Fees and rewards are variable and subject to change without notice and you enter pools at your own
//   //   //               risk.
//   //   //             </div>
//   //   //             <div className="bg-gray-200 dark:bg-slate-200 dark:bg-opacity-5 my-2 h-px"></div>
//   //   //           </div>
//   //   //           <div className="flex flex-col gap-5">
//   //   //             <div className="flex items-center justify-start gap-3 pt-2">
//   //   //               <svg
//   //   //                 xmlns="http://www.w3.org/2000/svg"
//   //   //                 height="20"
//   //   //                 className="text-gray-700 dark:text-slate-50"
//   //   //                 fill="none"
//   //   //                 viewBox="0 0 116 28"
//   //   //               >
//   //   //                 <path
//   //   //                   fill="url(#paint0_linear_12919_18029)"
//   //   //                   fill-rule="evenodd"
//   //   //                   d="M29.642 18.15l-5.905 8.256c-.86 1.204-2.537 1.734-4.673 1.562-2.967-.258-6.909-1.834-10.679-4.543a29.824 29.824 0 01-3.474-2.886C2.914 18.6 1.446 16.581.66 14.781c-.86-1.978-.888-3.726-.028-4.93l5.92-8.257C7.41.39 9.072-.14 11.222.032c2.968.243 6.895 1.834 10.679 4.53 3.77 2.708 6.537 5.933 7.712 8.657.101.234.191.464.27.69.584 1.693.517 3.179-.242 4.24z"
//   //   //                   clip-rule="evenodd"
//   //   //                 ></path>
//   //   //                 <path
//   //   //                   fill="#fff"
//   //   //                   fill-rule="evenodd"
//   //   //                   d="M28.696 13.62c-1.132-2.594-3.784-5.647-7.396-8.228-3.598-2.58-7.339-4.113-10.162-4.343-1.72-.143-3.082.173-3.77 1.133l-.03.057c-.644.96-.5 2.322.173 3.87 1.132 2.61 3.784 5.662 7.382 8.242 3.598 2.58 7.339 4.114 10.162 4.344 1.692.128 3.025-.173 3.727-1.076l.044-.071c.688-.946.544-2.351-.13-3.928zm-5.289.058c-.315.444-.96.573-1.748.501-1.42-.114-3.283-.889-5.09-2.178-1.805-1.29-3.138-2.81-3.697-4.114-.316-.731-.401-1.376-.086-1.82.316-.445.96-.574 1.763-.517 1.404.13 3.282.889 5.074 2.18 1.806 1.289 3.14 2.823 3.698 4.127.33.731.416 1.376.086 1.82z"
//   //   //                   clip-rule="evenodd"
//   //   //                 ></path>
//   //   //                 <path
//   //   //                   fill="#fff"
//   //   //                   d="M43.986 26.696c-1.761 0-3.528-.326-5.3-.977-1.772-.65-3.271-1.51-4.498-2.577l2.881-4.291a12.34 12.34 0 003.314 2.05c1.25.512 2.44.768 3.57.768.94 0 1.73-.171 2.37-.512.651-.342.977-.796.977-1.361 0-.203-.043-.385-.128-.545-.086-.16-.23-.31-.433-.448a4.451 4.451 0 00-.608-.352 5.309 5.309 0 00-.88-.336c-.374-.118-.7-.209-.977-.273a46.676 46.676 0 00-1.169-.304c-5.337-1.302-8.005-3.762-8.005-7.38 0-2.082.817-3.747 2.45-4.996 1.633-1.259 3.789-1.889 6.468-1.889 1.675 0 3.223.256 4.642.769 1.43.512 2.594 1.185 3.49 2.017l-2.593 4.307c-.683-.62-1.532-1.116-2.546-1.49a8.573 8.573 0 00-3.057-.576c-.897 0-1.628.155-2.194.465-.566.31-.848.71-.848 1.2 0 .524.33.956.992 1.297.673.342 1.596.651 2.77.929.395.085.758.176 1.089.272.341.085.81.235 1.409.448.608.203 1.152.427 1.633.673.49.245 1.014.565 1.569.96a6.66 6.66 0 011.377 1.281c.373.46.683 1.014.928 1.665.256.651.384 1.345.384 2.082 0 1.387-.4 2.63-1.2 3.73-.801 1.088-1.89 1.926-3.267 2.513-1.376.587-2.913.88-4.61.88zM68.865 24.759c-1.462 1.291-3.4 1.937-5.811 1.937-2.413 0-4.35-.646-5.812-1.937-1.462-1.302-2.194-3.02-2.194-5.155V9.58h5.316v9.27c0 .811.245 1.462.736 1.953.502.491 1.153.737 1.953.737.801 0 1.447-.246 1.938-.737.501-.49.752-1.142.752-1.953v-9.27h5.316v10.023c0 2.134-.732 3.853-2.194 5.155zM80.264 26.696c-2.679 0-5.102-.833-7.268-2.498l2.353-3.346c1.548 1.164 3.133 1.745 4.755 1.745.705 0 1.27-.096 1.697-.288.427-.203.64-.48.64-.832 0-.363-.224-.64-.672-.833-.437-.192-1.12-.384-2.05-.576-.49-.107-.885-.192-1.184-.256a20.952 20.952 0 01-1.168-.353 8.205 8.205 0 01-1.201-.48c-.3-.17-.64-.395-1.025-.672a3.67 3.67 0 01-.88-.897 5.559 5.559 0 01-.529-1.185 5.047 5.047 0 01-.224-1.537c0-1.195.326-2.214.977-3.058.65-.843 1.505-1.462 2.561-1.857 1.057-.395 2.252-.592 3.586-.592 2.466 0 4.729.72 6.789 2.161l-2.37 3.346c-1.505-.939-2.913-1.408-4.226-1.408-.598 0-1.09.08-1.473.24-.374.16-.56.405-.56.736 0 .352.213.624.64.817.427.181 1.11.368 2.049.56.459.085.849.166 1.169.24.32.075.715.187 1.184.336.47.15.865.31 1.185.48.331.171.678.396 1.04.673.364.267.657.566.881.897.225.33.406.73.545 1.2.15.46.224.966.224 1.521 0 1.804-.7 3.208-2.097 4.211-1.388 1.003-3.17 1.505-5.348 1.505zM100.181 9.181c1.889 0 3.41.571 4.563 1.713 1.163 1.142 1.745 2.658 1.745 4.547v10.855h-5.316v-9.078c0-.875-.25-1.574-.752-2.097-.502-.534-1.169-.8-2.001-.8-.918 0-1.66.271-2.226.816-.555.544-.832 1.26-.832 2.145v9.014h-5.3V2.68h5.3v8.47c1.28-1.314 2.887-1.97 4.819-1.97zM112.364 7.772c-.918 0-1.686-.304-2.305-.912-.619-.62-.929-1.388-.929-2.306 0-.94.31-1.713.929-2.321.619-.62 1.387-.929 2.305-.929.94 0 1.713.31 2.322.929.619.608.928 1.382.928 2.321 0 .918-.309 1.686-.928 2.306-.609.608-1.382.912-2.322.912zm-2.641 18.524V9.58h5.299v16.715h-5.299z"
//   //   //                 ></path>
//   //   //                 <defs>
//   //   //                   <linearGradient
//   //   //                     id="paint0_linear_12919_18029"
//   //   //                     x1="39.25"
//   //   //                     x2="42.065"
//   //   //                     y1="-0.338"
//   //   //                     y2="31.385"
//   //   //                     gradientUnits="userSpaceOnUse"
//   //   //                   >
//   //   //                     <stop stop-color="#27B0E6"></stop>
//   //   //                     <stop offset="0.107" stop-color="#49A1DB"></stop>
//   //   //                     <stop offset="0.288" stop-color="#7D8ACA"></stop>
//   //   //                     <stop offset="0.445" stop-color="#A279BD"></stop>
//   //   //                     <stop offset="0.572" stop-color="#BA6FB6"></stop>
//   //   //                     <stop offset="0.651" stop-color="#C26BB3"></stop>
//   //   //                     <stop offset="0.678" stop-color="#D563AD"></stop>
//   //   //                     <stop offset="0.715" stop-color="#E65BA7"></stop>
//   //   //                     <stop offset="0.76" stop-color="#F156A3"></stop>
//   //   //                     <stop offset="0.824" stop-color="#F853A1"></stop>
//   //   //                     <stop offset="1" stop-color="#FA52A0"></stop>
//   //   //                   </linearGradient>
//   //   //                 </defs>
//   //   //               </svg>
//   //   //             </div>
//   //   //             <div className="text-sm sm:text-[0.625rem] leading-5 sm:leading-4 text-gray-600 dark:text-slate-400">
//   //   //               Our community is building a comprehensive decentralized trading platform for the future of finance.
//   //   //               Join us!
//   //   //             </div>
//   //   //             <div className="flex items-center gap-4">
//   //   //               <a href="https://github.com/sushiswap" target="_blank" rel="noopener noreferrer">
//   //   //                 <svg
//   //   //                   viewBox="0 0 256 250"
//   //   //                   version="1.1"
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                   preserveAspectRatio="xMidYMid"
//   //   //                   width="16"
//   //   //                   className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
//   //   //                 >
//   //   //                   <g>
//   //   //                     <path
//   //   //                       d="M128.00106,0 C57.3172926,0 0,57.3066942 0,128.00106 C0,184.555281 36.6761997,232.535542 87.534937,249.460899 C93.9320223,250.645779 96.280588,246.684165 96.280588,243.303333 C96.280588,240.251045 96.1618878,230.167899 96.106777,219.472176 C60.4967585,227.215235 52.9826207,204.369712 52.9826207,204.369712 C47.1599584,189.574598 38.770408,185.640538 38.770408,185.640538 C27.1568785,177.696113 39.6458206,177.859325 39.6458206,177.859325 C52.4993419,178.762293 59.267365,191.04987 59.267365,191.04987 C70.6837675,210.618423 89.2115753,204.961093 96.5158685,201.690482 C97.6647155,193.417512 100.981959,187.77078 104.642583,184.574357 C76.211799,181.33766 46.324819,170.362144 46.324819,121.315702 C46.324819,107.340889 51.3250588,95.9223682 59.5132437,86.9583937 C58.1842268,83.7344152 53.8029229,70.715562 60.7532354,53.0843636 C60.7532354,53.0843636 71.5019501,49.6441813 95.9626412,66.2049595 C106.172967,63.368876 117.123047,61.9465949 128.00106,61.8978432 C138.879073,61.9465949 149.837632,63.368876 160.067033,66.2049595 C184.49805,49.6441813 195.231926,53.0843636 195.231926,53.0843636 C202.199197,70.715562 197.815773,83.7344152 196.486756,86.9583937 C204.694018,95.9223682 209.660343,107.340889 209.660343,121.315702 C209.660343,170.478725 179.716133,181.303747 151.213281,184.472614 C155.80443,188.444828 159.895342,196.234518 159.895342,208.176593 C159.895342,225.303317 159.746968,239.087361 159.746968,243.303333 C159.746968,246.709601 162.05102,250.70089 168.53925,249.443941 C219.370432,232.499507 256,184.536204 256,128.00106 C256,57.3066942 198.691187,0 128.00106,0 Z M47.9405593,182.340212 C47.6586465,182.976105 46.6581745,183.166873 45.7467277,182.730227 C44.8183235,182.312656 44.2968914,181.445722 44.5978808,180.80771 C44.8734344,180.152739 45.876026,179.97045 46.8023103,180.409216 C47.7328342,180.826786 48.2627451,181.702199 47.9405593,182.340212 Z M54.2367892,187.958254 C53.6263318,188.524199 52.4329723,188.261363 51.6232682,187.366874 C50.7860088,186.474504 50.6291553,185.281144 51.2480912,184.70672 C51.8776254,184.140775 53.0349512,184.405731 53.8743302,185.298101 C54.7115892,186.201069 54.8748019,187.38595 54.2367892,187.958254 Z M58.5562413,195.146347 C57.7719732,195.691096 56.4895886,195.180261 55.6968417,194.042013 C54.9125733,192.903764 54.9125733,191.538713 55.713799,190.991845 C56.5086651,190.444977 57.7719732,190.936735 58.5753181,192.066505 C59.3574669,193.22383 59.3574669,194.58888 58.5562413,195.146347 Z M65.8613592,203.471174 C65.1597571,204.244846 63.6654083,204.03712 62.5716717,202.981538 C61.4524999,201.94927 61.1409122,200.484596 61.8446341,199.710926 C62.5547146,198.935137 64.0575422,199.15346 65.1597571,200.200564 C66.2704506,201.230712 66.6095936,202.705984 65.8613592,203.471174 Z M75.3025151,206.281542 C74.9930474,207.284134 73.553809,207.739857 72.1039724,207.313809 C70.6562556,206.875043 69.7087748,205.700761 70.0012857,204.687571 C70.302275,203.678621 71.7478721,203.20382 73.2083069,203.659543 C74.6539041,204.09619 75.6035048,205.261994 75.3025151,206.281542 Z M86.046947,207.473627 C86.0829806,208.529209 84.8535871,209.404622 83.3316829,209.4237 C81.8013,209.457614 80.563428,208.603398 80.5464708,207.564772 C80.5464708,206.498591 81.7483088,205.631657 83.2786917,205.606221 C84.8005962,205.576546 86.046947,206.424403 86.046947,207.473627 Z M96.6021471,207.069023 C96.7844366,208.099171 95.7267341,209.156872 94.215428,209.438785 C92.7295577,209.710099 91.3539086,209.074206 91.1652603,208.052538 C90.9808515,206.996955 92.0576306,205.939253 93.5413813,205.66582 C95.054807,205.402984 96.4092596,206.021919 96.6021471,207.069023 Z"
//   //   //                       fill="currentColor"
//   //   //                     ></path>
//   //   //                   </g>
//   //   //                 </svg>
//   //   //               </a>
//   //   //               <a href="https://twitter.com/sushiswap" target="_blank" rel="noopener noreferrer">
//   //   //                 <svg
//   //   //                   width="16"
//   //   //                   className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
//   //   //                   viewBox="0 0 19 14"
//   //   //                   fill="none"
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                 >
//   //   //                   <path
//   //   //                     d="M18.2178 1.70269C17.5567 1.98019 16.8466 2.16769 16.1001 2.25244C16.8704 1.81578 17.4466 1.12854 17.7214 0.318936C16.9977 0.726178 16.2056 1.01283 15.3796 1.16644C14.8242 0.604585 14.0885 0.23218 13.2867 0.107041C12.485 -0.018098 11.6621 0.111029 10.9457 0.474375C10.2294 0.837721 9.65968 1.41496 9.3251 2.11646C8.99053 2.81797 8.90978 3.6045 9.0954 4.35394C7.62898 4.28418 6.19444 3.9231 4.88486 3.29411C3.57528 2.66513 2.41994 1.78231 1.49381 0.702936C1.17715 1.22044 0.995063 1.82044 0.995063 2.45944C0.994709 3.03468 1.14424 3.60112 1.43038 4.10848C1.71653 4.61585 2.13044 5.04846 2.6354 5.36794C2.04978 5.35028 1.47709 5.20037 0.964979 4.93069V4.97569C0.96492 5.78249 1.25951 6.56447 1.79875 7.18893C2.33799 7.8134 3.08868 8.24188 3.92344 8.40169C3.38018 8.54097 2.81062 8.56149 2.25777 8.46169C2.49329 9.1559 2.95206 9.76296 3.56985 10.1979C4.18765 10.6328 4.93354 10.8738 5.7031 10.8872C4.39672 11.8587 2.78335 12.3858 1.12252 12.3834C0.828323 12.3835 0.534373 12.3672 0.242188 12.3347C1.92802 13.3616 3.89046 13.9066 5.89469 13.9044C12.6793 13.9044 16.3882 8.58094 16.3882 3.96394C16.3882 3.81394 16.3843 3.66244 16.3771 3.51244C17.0986 3.01817 17.7213 2.40611 18.2162 1.70494L18.2178 1.70269Z"
//   //   //                     fill="currentColor"
//   //   //                   ></path>
//   //   //                 </svg>
//   //   //               </a>
//   //   //               <a href="https://instagram.com/instasushiswap" target="_blank" rel="noopener noreferrer">
//   //   //                 <svg
//   //   //                   width="16"
//   //   //                   className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
//   //   //                   viewBox="0 0 24 24"
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                 >
//   //   //                   <path
//   //   //                     fill="currentColor"
//   //   //                     d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"
//   //   //                   ></path>
//   //   //                 </svg>
//   //   //               </a>
//   //   //               <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noopener noreferrer">
//   //   //                 <svg
//   //   //                   viewBox="0 0 256 199"
//   //   //                   version="1.1"
//   //   //                   xmlns="http://www.w3.org/2000/svg"
//   //   //                   preserveAspectRatio="xMidYMid"
//   //   //                   width="16"
//   //   //                   className="text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-50"
//   //   //                 >
//   //   //                   <g>
//   //   //                     <path
//   //   //                       d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
//   //   //                       fill="currentColor"
//   //   //                       fill-rule="nonzero"
//   //   //                     ></path>
//   //   //                   </g>
//   //   //                 </svg>
//   //   //               </a>
//   //   //             </div>
//   //   //           </div>
//   //   //           <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-[40px] sm:mt-[10px]">
//   //   //             <div className="flex flex-col gap-[10px]">
//   //   //               <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Services</span>
//   //   //               <a
//   //   //                 href="https://www.sushi.com/swap"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Swap
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://www.sushi.com/earn"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Earn
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://www.sushi.com/furo"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Payments
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://www.sushi.com/analytics"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Analytics
//   //   //               </a>
//   //   //             </div>
//   //   //             <div className="flex flex-col gap-[10px]">
//   //   //               <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Help</span>
//   //   //               <a
//   //   //                 href="https://www.sushi.com/academy"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Academy
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://docs.sushi.com"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 About Us
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://discord.gg/NVPXN4e"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Discord Support
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://twitter.com/sushiswap"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Twitter Support
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://forum.sushi.com"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Forum Support
//   //   //               </a>
//   //   //             </div>
//   //   //             <div className="flex flex-col gap-[10px]">
//   //   //               <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Developers</span>
//   //   //               <a
//   //   //                 href="https://docs.sushi.com"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 GitBook
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://github.com/sushiswap"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 GitHub
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://dev.sushi.com"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Development
//   //   //               </a>
//   //   //               <a
//   //   //                 href="https://docs.openmev.org"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 SushiGuard
//   //   //               </a>
//   //   //             </div>
//   //   //             <div className="flex flex-col gap-6">
//   //   //               <div className="flex flex-col gap-[10px]">
//   //   //                 <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Governance</span>
//   //   //                 <a
//   //   //                   href="https://forum.sushi.com"
//   //   //                   target="_blank"
//   //   //                   rel="noopener noreferrer"
//   //   //                   className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //                 >
//   //   //                   Forum &amp; Proposals
//   //   //                 </a>
//   //   //                 <a
//   //   //                   href="https://snapshot.org/#/sushigov.eth"
//   //   //                   target="_blank"
//   //   //                   rel="noopener noreferrer"
//   //   //                   className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //                 >
//   //   //                   Vote
//   //   //                 </a>
//   //   //               </div>
//   //   //               <div className="flex flex-col gap-[10px]">
//   //   //                 <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Partners</span>
//   //   //                 <a
//   //   //                   href="https://www.klimadao.finance/"
//   //   //                   target="_blank"
//   //   //                   rel="noopener noreferrer"
//   //   //                   className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //                 >
//   //   //                   KlimaDAO
//   //   //                 </a>
//   //   //                 <a
//   //   //                   href="https://www.manifoldfinance.com/"
//   //   //                   target="_blank"
//   //   //                   rel="noopener noreferrer"
//   //   //                   className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //                 >
//   //   //                   Manifold Finance
//   //   //                 </a>
//   //   //               </div>
//   //   //             </div>
//   //   //             <div className="flex flex-col gap-[10px]">
//   //   //               <span className="text-sm sm:text-xs text-gray-900 dark:text-slate-100">Protocol</span>
//   //   //               <a
//   //   //                 href="https://docs.google.com/document/d/1VcdrqAn1sR8Wa0BSSU-jAl68CfoECR62LCzIyzUpZ_U"
//   //   //                 target="_blank"
//   //   //                 rel="noopener noreferrer"
//   //   //                 className="text-sm cursor-pointer sm:text-xs text-gray-600 dark:text-slate-400 hover:underline"
//   //   //               >
//   //   //                 Apply for Onsen
//   //   //               </a>
//   //   //             </div>
//   //   //           </div>
//   //   //         </div>
//   //   //         <div className="w-full max-w-7xl mx-auto mt-20 mb-5">
//   //   //           <div className="flex justify-between py-2 mx-4 border-t text-gray-600 border-gray-200 dark:border-slate-800">
//   //   //             <span className="text-xs text-gray-600 dark:text-slate-400">
//   //   //               Copyright © 2022 Sushi. All rights reserved.
//   //   //             </span>
//   //   //             <div className="flex divide-x dark:divide-slate-200/20 gap-">
//   //   //               <a
//   //   //                 href="https://www.sushi.com/terms-of-use"
//   //   //                 className="text-xs font-medium px-3 text-gray-600 dark:text-slate-300"
//   //   //               >
//   //   //                 Terms of Use
//   //   //               </a>
//   //   //             </div>
//   //   //           </div>
//   //   //         </div>
//   //   //       </footer>
//   //   //       {/* <Typography
//   //   //         onClick={() => {}}
//   //   //         as="button"
//   //   //         weight={600}
//   //   //         variant="sm"
//   //   //         className="flex items-center gap-1 py-2 pl-3 pr-2 rounded-lg cursor-pointer bg-neutral-700
//   //   //         hover:bg-neutral-600 text-neutral-300 hover:text-neutral-200"
//   //   //       ></Typography> */}
//   //   //     </div>
//   //   //   </div>
//   //   // </div>
//   //   <div className="relative flex flex-col gap-3">
//   //     <div className="absolute z-10 flex w-full gap-4">
//   //       <div ref={ref} onFocus={() => setOpen(true)} className="relative w-full bg-neutral-800 rounded-xl">
//   //         <div className="flex items-center gap-2 pl-4 pr-3 h-14">
//   //           <div
//   //             className={classNames(
//   //               selectNetwork ? 'opacity-40 pointer-events-none' : '',
//   //               'flex gap-2 items-center w-full'
//   //             )}
//   //           >
//   //             <div className="w-6 h-6">{/* <SearchIcon width={24} height={24} className="text-neutral-500" /> */}</div>
//   //             <input
//   //               value={query}
//   //               onChange={(e) => setQuery(e.target.value)}
//   //               placeholder="Search by token or address"
//   //               className={classNames('!text-lg w-full placeholder:text-neutral-500', DEFAULT_INPUT_UNSTYLED)}
//   //               autoComplete="new-password"
//   //               autoCorrect="off"
//   //             />
//   //           </div>
//   //           <Typography
//   //             onClick={() => setSelectNetwork((prev) => !prev)}
//   //             as="button"
//   //             weight={600}
//   //             variant="sm"
//   //             className="flex items-center gap-1 py-2 pl-3 pr-2 rounded-lg cursor-pointer bg-neutral-700 hover:bg-neutral-600 text-neutral-300 hover:text-neutral-200"
//   //           >
//   //             {/* {chainShortName[ChainId].toUpperCase()} <ChevronDownIcon width={16} height={16} /> */}
//   //           </Typography>
//   //         </div>
//   //         <div
//   //           className={classNames(
//   //             open ? 'max-h-[335px] py-2' : 'max-h-[0px]',
//   //             'z-[100] bg-neutral-800 rounded-b-xl flex flex-col gap-2 overflow-hidden transition-all scroll overflow-y-auto'
//   //           )}
//   //         >
//   //           {selectNetwork ? (
//   //             <>
//   //               <Typography variant="sm" weight={600} className="px-4 text-neutral-400">
//   //                 Networks
//   //               </Typography>
//   //               {/* {SUPPORTED_CHAIN_IDS.map((el) => (
//   //                 <Row
//   //                   key={el}
//   //                   isNetwork={true}
//   //                   currency={Native.onChain(el)}
//   //                   onClick={() => {
//   //                     setSelectNetwork(false)
//   //                     setChainId(el)
//   //                   }}
//   //                 />
//   //               ))} */}
//   //             </>
//   //           ) : query.length > 2 ? (
//   //             <>
//   //               <Typography variant="sm" weight={600} className="px-4 text-neutral-400">
//   //                 Tokens
//   //               </Typography>
//   //               {/* {isAddress(query) && web3Loading ? (
//   //                 skeleton
//   //               ) : web3Token ? (
//   //                 <Row
//   //                   currency={
//   //                     new Token({
//   //                       address: web3Token.address,
//   //                       name: web3Token.name,
//   //                       symbol: web3Token.symbol,
//   //                       chainId: ChainId.ETHEREUM,
//   //                       decimals: web3Token.decimals,
//   //                     })
//   //                   }
//   //                 />
//   //               ) : query.length > 2 && query !== debouncedQuery ? (
//   //                 skeleton
//   //               ) : filteredTokens ? (
//   //                 <>
//   //                   {filteredTokens.map(({ address, name, symbol, chainId, decimals }) => (
//   //                     <Row
//   //                       key={address}
//   //                       currency={
//   //                         new Token({
//   //                           address,
//   //                           name,
//   //                           symbol,
//   //                           chainId,
//   //                           decimals,
//   //                         })
//   //                       }
//   //                     />
//   //                   ))}
//   //                 </>
//   //               ) : (
//   //                 <></>
//   //               )} */}
//   //             </>
//   //           ) : (
//   //             <>
//   //               <Typography variant="sm" weight={600} className="flex items-center gap-2 px-4 text-neutral-400">
//   //                 <StarIcon width={16} height={16} /> Popular Tokens
//   //               </Typography>
//   //               <div className="flex flex-col gap-2">
//   //                 {/* {EXAMPLE_CURRENCIES.map((el) => (
//   //                   <Row currency={el} key={`example-${el.address}`} />
//   //                 ))} */}
//   //               </div>
//   //             </>
//   //           )}
//   //         </div>
//   //       </div>
//   //     </div>
//   //   </div>
//   // )
// }

// const Row: FC<{
//   // currency: Type;
//   onClick?(): void
//   isNetwork?: boolean
// }> = ({
//   // currency,
//   onClick,
//   isNetwork = false,
// }) => {
//   const content = (
//     <div
//       className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-neutral-700"
//       // key={currency.wrapped.address}
//     >
//       <div className="w-[36px] h-[36px]">
//         {/* {isNetwork ? (
//           <NetworkIcon chainId={currency.chainId} width={36} height={36} />
//         ) : (
//           <Currency.Icon disableLink currency={currency} width={36} height={36} />
//         )} */}
//       </div>
//       <div className="flex flex-col">
//         {/* <Typography weight={600}>{isNetwork ? chains[currency.chainId].name : currency.name}</Typography> */}
//         <Typography variant="sm" weight={600} className="text-left text-neutral-400">
//           {/* {currency.symbol} */}
//         </Typography>
//       </div>
//     </div>
//   )
//   if (onClick) {
//     return (
//       <button type="button" onClick={onClick}>
//         {content}
//       </button>
//     )
//   }
//   return (
//     <a href={`https://www.sushi.com/swap?token0=NATIVE&token1=${currency.wrapped.address}&chainId=${currency.chainId}`}>
//       {content}
//     </a>
//   )
// }
