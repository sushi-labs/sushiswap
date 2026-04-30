'use client'

import { Button, LinkInternal, SkeletonText } from '@sushiswap/ui'
import { perpsNumberFormatter, useSushiPointsOverview } from 'src/lib/perps'
import { useAccount } from 'src/lib/wallet'
import { PerpsCard } from '~evm/perps/_ui/_common'

export function Points() {
  const address = useAccount('evm')
  const { data, isLoading, error } = useSushiPointsOverview({ address })

  return (
    <div className="relative overflow-hidden">
      <div className=" lg:h-[420px] w-[310px] h-[310px] lg:w-[420px] rounded-full bg-sushi-gradient-full-opacity absolute left-[60%] -translate-x-[60%] opacity-40 top-4 blur-[336px] z-0" />
      <div className="relative z-10">
        <PerpsCard
          className="p-2 lg:p-4 flex flex-col lg:flex-row gap-6 justify-between"
          fullWidth
          fullHeight
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="flex items-center gap-2">
              <Trophy />
              <div className="text-perps-muted font-medium lg:text-lg">
                Points (Season 1)
              </div>
            </div>
            <div className="flex gap-2 lg:gap-8 flex-col lg:flex-row">
              <_Item
                label="Total Points Earned"
                value={data?.totalPoints}
                isLoading={isLoading}
                error={Boolean(error)}
              />
              <_Item
                label="Points Earned (7D)"
                value={data?.points7d}
                isLoading={isLoading}
                error={Boolean(error)}
              />
              <_Item
                label="Points Earned (30D)"
                value={data?.points30d}
                isLoading={isLoading}
                error={Boolean(error)}
              />
            </div>
          </div>
          <LinkInternal href="/perps/points" className="lg:!my-auto">
            <Button variant="perps-secondary" className="w-full">
              <span className="bg-gradient-to-r from-[#27B0E6] from-4% via-[#7D8ACA] via-5% to-[#FA52A0] to-100% text-transparent bg-clip-text">
                Dashboard
              </span>
            </Button>
          </LinkInternal>
        </PerpsCard>
      </div>
    </div>
  )
}

const _Item = ({
  label,
  value,
  isLoading,
  error,
}: {
  label: string
  value: number | undefined
  isLoading: boolean
  error: boolean
}) => {
  return (
    <div>
      <div className="text-perps-muted-50 text-xs lg:text-sm">{label}</div>
      {isLoading ? (
        <div className="w-24 h-8">
          <SkeletonText fontSize="xl" />
        </div>
      ) : error ? (
        <div className="font-medium text-lg md:text-2xl text-red-500">
          Error
        </div>
      ) : (
        <div className="font-medium text-lg md:text-2xl">
          {value
            ? perpsNumberFormatter({
                value,
                minFraxDigits: 0,
                maxFraxDigits: 0,
              })
            : '0'}
        </div>
      )}
    </div>
  )
}

const Trophy = () => {
  return (
    <div className="shadow-[inset_1.5px_2px_1px_-2px_rgba(255,255,255,0.3),inset_-1.5px_-1.5px_1px_-2px_rgba(255,255,255,0.225)] rounded-full h-[48px] w-[48px] flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="48"
          height="48"
          rx="24"
          fill="url(#paint0_linear_1413_107564)"
          fillOpacity="0.12"
        />
        <path
          d="M24.0033 28.1667V25.6667M29 18.1667H29.8333C30.7538 18.1667 31.5 18.9129 31.5 19.8333C31.5 21.214 30.3807 22.3333 29 22.3333M29 18.1667V20.6667C29 23.4281 26.7614 25.6667 24 25.6667C21.2386 25.6667 19 23.4281 19 20.6667V18.1667M29 18.1667C29 17.2462 28.2538 16.5 27.3333 16.5H20.6667C19.7462 16.5 19 17.2462 19 18.1667M19 18.1667H18.1667C17.2462 18.1667 16.5 18.9129 16.5 19.8333C16.5 21.214 17.6193 22.3333 19 22.3333M28.1667 29.8333C28.1667 30.7538 27.4205 31.5 26.5 31.5H21.5C20.5795 31.5 19.8333 30.7538 19.8333 29.8333C19.8333 28.9129 20.5795 28.1667 21.5 28.1667H26.5C27.4205 28.1667 28.1667 28.9129 28.1667 29.8333Z"
          stroke="url(#paint1_linear_1413_107564)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1413_107564"
            x1="0"
            y1="0"
            x2="57.9256"
            y2="22.9731"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#27B0E6" />
            <stop offset="0.044" stopColor="#49A1DB" />
            <stop offset="0.11841" stopColor="#7D8ACA" />
            <stop offset="0.21562" stopColor="#A279BD" />
            <stop offset="0.29605" stopColor="#BA6FB6" />
            <stop offset="0.37529" stopColor="#C26BB3" />
            <stop offset="0.46788" stopColor="#D563AD" />
            <stop offset="0.57967" stopColor="#E65BA7" />
            <stop offset="0.70861" stopColor="#F156A3" />
            <stop offset="0.82293" stopColor="#F853A1" />
            <stop offset="1" stopColor="#FA52A0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1413_107564"
            x1="16.5"
            y1="16.5"
            x2="34.6017"
            y2="23.6791"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#27B0E6" />
            <stop offset="0.044" stopColor="#49A1DB" />
            <stop offset="0.11841" stopColor="#7D8ACA" />
            <stop offset="0.21562" stopColor="#A279BD" />
            <stop offset="0.29605" stopColor="#BA6FB6" />
            <stop offset="0.37529" stopColor="#C26BB3" />
            <stop offset="0.46788" stopColor="#D563AD" />
            <stop offset="0.57967" stopColor="#E65BA7" />
            <stop offset="0.70861" stopColor="#F156A3" />
            <stop offset="0.82293" stopColor="#F853A1" />
            <stop offset="1" stopColor="#FA52A0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
