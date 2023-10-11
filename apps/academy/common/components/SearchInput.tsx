import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useBreakpoint } from '@sushiswap/hooks'
import { classNames } from '@sushiswap/ui'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { getTrendingSearch } from 'lib/api'
import {
  ChangeEvent,
  FC,
  FormEvent,
  RefObject,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import useSWR from 'swr'

import { APP_HEADER_HEIGHT } from '../helpers'

interface SearchInput {
  handleSearch: (value: string) => void
  isTopOfPage?: boolean
  showTopics?: boolean
  className?: string
  ref?: RefObject<HTMLDivElement>
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export const SearchInput: FC<SearchInput> = ({
  ref,
  handleSearch,
  isTopOfPage,
  showTopics,
  className,
}) => {
  const [isSticky, setIsSticky] = useState(isTopOfPage)
  const { isSm } = useBreakpoint('sm')
  const [isMobileAndSticky, setIsMobileAndSticky] = useState(isSticky)
  const { data } = useSWR(
    showTopics && '/trending-search',
    async () => await getTrendingSearch(),
  )
  const trendingTopics: string[] | undefined =
    data?.trendingSearch?.data?.attributes?.topics

  const [input, setInput] = useState('')

  useIsomorphicLayoutEffect(() => {
    const cachedRef = ref?.current
    if (cachedRef) {
      const observer = new IntersectionObserver(
        ([e]) => setIsSticky(!e.isIntersecting),
        {
          threshold: APP_HEADER_HEIGHT / cachedRef.clientHeight,
        },
      )
      observer.observe(cachedRef)

      return () => {
        observer.unobserve(cachedRef)
      }
    }
  }, [ref])

  useLayoutEffect(() => {
    setIsMobileAndSticky(!isSm && isSticky)
  }, [isSm, isSticky])

  const onInputchange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSearch = (value: string) => {
    handleSearch(value)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch(input)
  }

  const onTopicClick = (topic: string) => {
    setInput(topic)
    onSearch(topic)
  }

  return (
    <>
      <div
        className={classNames(
          className,
          'z-10 flex w-full h-[56px] sm:h-16 pl-6 px-4 sticky sm:relative top-[54px] sm:top-[unset]',
          isMobileAndSticky && 'bg-slate-900 border-b border-slate-800',
        )}
      >
        <form
          onSubmit={onSubmit}
          className={classNames(
            'flex max-w-[870px] w-full mx-auto h-full rounded-full pr-3.5 py-1.5 items-center transition ease-in-out duration-300',
            isMobileAndSticky ? 'bg-slate-900' : 'bg-slate-800 pl-6',
          )}
        >
          <input
            placeholder="Search for the product/topic you want to learn about"
            onChange={onInputchange}
            value={input}
            className={classNames(
              'w-full text-sm truncate bg-transparent sm:text-lg outline-0',
              isMobileAndSticky
                ? 'sm:order-1 order-2 pl-3 placeholder:text-slate-500 font-medium'
                : 'order-1 sm:placeholder:text-slate-400 placeholder:text-slate-50 sm:font-medium',
            )}
          />
          <IconButton
            type="submit"
            className={classNames(
              'sm:bg-[#3B7EF6] rounded-full',
              isMobileAndSticky ? 'sm:order-2 order-1' : 'order-2 ml-2 p-2.5',
            )}
            icon={MagnifyingGlassIcon}
            iconProps={{
              className: isMobileAndSticky
                ? 'fill-slate-500'
                : 'fill-[#3B7EF6] sm:fill-white',
            }}
            name="Search"
          />
        </form>
      </div>
      {showTopics && (
        <div className="mt-4 text-center">
          <span className="block text-xs sm:text-sm text-slate-400 sm:inline">
            Try:
          </span>
          <div className="mt-2 ml-2 sm:ml-0 sm:mt-0 sm:inline">
            {!trendingTopics ? (
              <>
                <div className="inline-block w-20 h-4 ml-2 align-middle rounded-full bg-slate-700 animate-pulse" />
                <div className="inline-block h-4 ml-2 align-middle rounded-full w-14 bg-slate-700 animate-pulse" />
                <div className="inline-block h-4 ml-2 align-middle rounded-full w-28 bg-slate-700 animate-pulse" />
                <div className="inline-block w-12 h-4 ml-2 align-middle rounded-full bg-slate-700 animate-pulse" />
                <div className="inline-block w-20 h-4 ml-2 align-middle rounded-full bg-slate-700 animate-pulse" />
                <div className="inline-block h-4 ml-2 align-middle rounded-full w-14 bg-slate-700 animate-pulse" />
              </>
            ) : (
              trendingTopics.map((topic, i, a) => (
                <button
                  className="ml-2 text-xs font-medium sm:text-sm hover:underline"
                  key={topic}
                  type="button"
                  onClick={() => onTopicClick(topic)}
                >
                  {topic}
                  {i === a.length - 1 ? '' : ','}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
