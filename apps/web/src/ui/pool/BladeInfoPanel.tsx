import { ArrowRightIcon, CheckIcon } from '@heroicons/react-v1/solid'
import {
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  classNames,
} from '@sushiswap/ui'
import { useTheme } from 'next-themes'
import { Wrapper } from '../swap/trade/wrapper'

type TabKey = 'profit' | 'impermanent' | 'mev'

const TABS: {
  key: TabKey
  title: string
  heading: string
  description: string
  cta: string
  href: string
}[] = [
  {
    key: 'profit',
    title: 'Superior Profit-Based Yields',
    heading: 'Superior Profit-Based Yields',
    description:
      'Your yield is profit-based. Blade generates LP yields by making smart trades, not by charging fees while disguising your losses as "impermanent."',
    cta: 'How Blade Generates Superior Yields?',
    href: '#',
  },
  {
    key: 'impermanent',
    title: 'No Impermanent Loss',
    heading: 'No Impermanent Loss',
    description:
      "Blade rebalances your liquidity faster than bots, so you never experience Impermanent Loss. It's not magic, it's offchain computation combined with onchain proof.",
    cta: 'What Is No Impermanent Loss Benchmark?',
    href: '#',
  },
  {
    key: 'mev',
    title: 'MEV-Proof',
    heading: 'MEV-Proof',
    description:
      'Blade’s novel Formula Market Maker (FMM) design uses token ratios in pools and decentralized price oracles to balance assets instead of a constant function model, eliminating arbitrage trading to align pool prices with market prices, providing firm price quotes resistant to MEV, and ensuring an MEV-proof system.',
    cta: 'Learn more about Blade’s Formula Market Maker Design',
    href: '#',
  },
]

export const BladeInfoPanel = () => {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  return (
    <Tabs defaultValue="profit">
      <div className="overflow-x-auto px-4 -mx-4 no-scrollbar snap-x snap-mandatory md:mx-0 md:px-0 hide-scrollbar">
        <TabsList className="inline-flex gap-2 min-w-max bg-slate-50 dark:bg-slate-800 md:gap-3 md:w-full">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="
        group w-full font-semibold !border-none text-muted-foreground
        data-[state=active]:font-medium
        data-[state=active]:!bg-[#4217FF14]
        {isDarkMode ? 'dark:data-[state=active]:!bg-[#3DB1FF14]' : ''}
        data-[state=active]:text-blue
        dark:data-[state=active]:text-skyblue
      "
            >
              <div
                className="
          flex justify-center items-center w-5 rounded-full aspect-1 mr-2
          bg-muted-foreground
          group-data-[state=active]:bg-blue
          dark:group-data-[state=active]:bg-skyblue
        "
              >
                <CheckIcon className="w-[12px] h-[12px] text-slate-50 dark:text-slate-800" />
              </div>
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TABS.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} asChild>
          <Wrapper className="px-4 !p-6 sm:py-12 min-h-[316px] w-full max-w-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-10 items-center w-full max-w-3xl text-center">
              <div className="flex flex-col gap-6 w-full max-w-full">
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center w-6 rounded-full bg-[#1DA67D] dark:bg-skyblue aspect-1">
                    <CheckIcon className="w-[14px] h-[14px] text-slate-50 dark:text-slate-800" />
                  </div>
                  <h2 className="flex gap-2 justify-center items-center text-xl font-bold md:text-2xl text-slate-900 dark:text-slate-50">
                    {tab.heading}
                  </h2>
                </div>
                <p
                  className={classNames(
                    'mx-auto md:text-lg text-muted-foreground px-4',
                    tab.key === 'mev' ? 'max-w-7xl' : 'max-w-3xl',
                  )}
                >
                  {tab.description}
                </p>
              </div>
              <Button
                asChild
                variant={isDarkMode ? 'tertiary' : 'quinary'}
                className="!rounded-full font-medium flex items-center justify-center gap-2 md:w-auto text-sm md:text-base whitespace-pre-line !h-auto"
              >
                <span>{tab.cta}</span>
                <div className="rounded-full bg-blue dark:bg-skyblue p-1 w-[14px] aspect-1 flex items-center justify-center shrink-0">
                  <ArrowRightIcon className="text-slate-50" />
                </div>
              </Button>
            </div>
          </Wrapper>
        </TabsContent>
      ))}
    </Tabs>
  )
}
