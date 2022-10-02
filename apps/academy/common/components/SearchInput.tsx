import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { classNames, IconButton, useBreakpoint } from '@sushiswap/ui'
import { ChangeEvent, FormEvent, forwardRef, MutableRefObject, useEffect, useState } from 'react'

interface SearchInput {
  handleSearch: (value: string) => void
  isTopOfPage?: boolean
  hideTopics?: boolean
  className?: string
}

export const SearchInput = forwardRef(
  ({ handleSearch, isTopOfPage, hideTopics, className }: SearchInput, ref: MutableRefObject<HTMLDivElement>) => {
    const [isSticky, setIsSticky] = useState(isTopOfPage)
    const { isSm } = useBreakpoint('sm')
    const appHeaderHeight = 54
    const isMobileStickySearchBar = !isSm && isSticky
    const topicSearches = ['SushiXSwap Multichain', 'Trident AMMs', 'Shoyu NFT Marketplace', 'Metaverse', 'Blockchain']
    const [input, setInput] = useState('')

    useEffect(() => {
      const cachedRef = ref?.current
      if (cachedRef) {
        const observer = new IntersectionObserver(([e]) => setIsSticky(!e.isIntersecting), {
          threshold: appHeaderHeight / cachedRef.clientHeight,
        })
        observer.observe(cachedRef)

        return () => {
          observer.unobserve(cachedRef)
        }
      }
    }, [ref])

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
            isMobileStickySearchBar && 'bg-slate-900 border-b border-slate-800'
          )}
        >
          <form
            onSubmit={onSubmit}
            className={classNames(
              'flex max-w-[870px] w-full mx-auto h-full rounded-full pr-1.5 py-1.5 items-center transition ease-in-out duration-300',
              isMobileStickySearchBar ? 'bg-slate-900' : 'bg-slate-800 pl-6'
            )}
          >
            <input
              placeholder="Search for the Product/Topic you want to learn"
              onChange={onInputchange}
              value={input}
              className={classNames(
                'w-full text-sm truncate bg-transparent sm:text-lg outline-0',
                isMobileStickySearchBar
                  ? 'sm:order-1 order-2 pl-3 placeholder:text-slate-500 font-medium'
                  : 'order-1 sm:placeholder:text-slate-400 placeholder:text-slate-50 sm:font-medium'
              )}
            />
            <IconButton
              type="submit"
              className={classNames(
                'sm:bg-[#3B7EF6] rounded-full',
                isMobileStickySearchBar ? 'sm:order-2 order-1' : 'order-2 ml-2 p-2.5 sm:p-[14px]'
              )}
            >
              <MagnifyingGlassIcon
                className={isMobileStickySearchBar ? 'w-5 h-5 fill-slate-500' : 'w-6 h-6 fill-[#3B7EF6] sm:fill-white'}
              />
            </IconButton>
          </form>
        </div>
        {!hideTopics && (
          <div className="mt-4 text-center">
            <span className="block text-xs sm:text-sm text-slate-400 sm:inline">Try:</span>
            <div className="mt-2 ml-2 sm:ml-0 sm:mt-0 sm:inline">
              {topicSearches.map((topic, i, a) => (
                <button
                  className="ml-2 text-xs font-medium sm:text-sm hover:underline"
                  key={topic}
                  onClick={() => onTopicClick(topic)}
                >
                  {topic}
                  {i === a.length - 1 ? '' : ','}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }
)
