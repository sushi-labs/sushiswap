'use client'

import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toggle,
  ToggleGroup,
} from '@sushiswap/ui'
import { type ReactNode, useState } from 'react'
import { TIMEFRAME_OPTIONS, type TimeframeOption } from './global-stats-charts'

export interface GlobalStatsChartCardProps {
  title: string
  summary: ReactNode
  timeframe: TimeframeOption
  onTimeframeChange?: (timeframe: TimeframeOption) => void
  showBlade?: boolean
  onDeselect?: () => void
  children: ReactNode
}

function getChartParts({
  title,
  summary,
  timeframe,
  onTimeframeChange,
  showBlade,
}: GlobalStatsChartCardProps): {
  heading: ReactNode
  timeframes: ReactNode
  legend: ReactNode
} {
  const heading = (
    <span className="flex min-w-0 flex-col gap-1 text-left font-normal">
      <span className="text-muted-foreground text-xs sm:text-sm">{title}</span>
      {summary}
    </span>
  )
  const timeframes = (
    <ToggleGroup className="h-fit">
      {TIMEFRAME_OPTIONS.map((time) => (
        <Toggle
          key={time}
          onClick={() => onTimeframeChange?.(time)}
          pressed={timeframe === time}
          size="xs"
          disabled={!onTimeframeChange}
        >
          {time}
        </Toggle>
      ))}
    </ToggleGroup>
  )
  const legend = (
    <div className="flex gap-2 self-end text-xs font-medium text-muted-foreground">
      {[
        { name: 'V2', color: 'bg-[#A0A0A0]' },
        { name: 'V3', color: 'bg-[#FA52A0]' },
        ...(showBlade ? [{ name: 'Blade', color: 'bg-[#F23BF6]' }] : []),
      ].map(({ name, color }) => (
        <span key={name} className="flex items-center gap-1">
          <span className={`rounded-full w-2 h-2 ${color}`} />
          {name}
        </span>
      ))}
    </div>
  )

  return { heading, timeframes, legend }
}

export function GlobalStatsChartCard(
  props: GlobalStatsChartCardProps,
): React.ReactElement {
  const { heading, timeframes, legend } = getChartParts(props)

  return (
    <Card>
      <CardContent className="pt-6 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap gap-1 justify-between">
            {heading}
            {timeframes}
          </div>
          {legend}
        </div>
        {props.children}
      </CardContent>
    </Card>
  )
}

export function GlobalStatsChartsLayout({
  charts,
}: {
  charts: (GlobalStatsChartCardProps & { value: 'tvl' | 'volume' })[]
}): React.ReactElement {
  const [activeChart, setActiveChart] = useState('tvl')

  return (
    <>
      <div className="sm:grid grid-cols-2 gap-4 hidden">
        {charts.map((chart) => (
          <GlobalStatsChartCard key={chart.value} {...chart} />
        ))}
      </div>
      <Card className="p-4 sm:hidden block">
        <Tabs
          value={activeChart}
          onValueChange={(value) => {
            charts.forEach((chart) => chart.onDeselect?.())
            setActiveChart(value)
          }}
        >
          <TabsList
            aria-label="Chain statistics"
            variant="underline"
            className="!grid grid-cols-2 items-stretch !gap-4"
          >
            {charts.map((chart) => (
              <TabsTrigger
                key={chart.value}
                value={chart.value}
                variant="underline"
                disabled={!chart.onTimeframeChange}
                className="min-w-0 !items-start !justify-start !whitespace-normal !pt-0 !pb-4"
              >
                {getChartParts(chart).heading}
              </TabsTrigger>
            ))}
          </TabsList>
          {charts.map((chart) => {
            const { timeframes, legend } = getChartParts(chart)

            return (
              <TabsContent
                key={chart.value}
                value={chart.value}
                className="!mt-4 min-w-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {timeframes}
                  {legend}
                </div>
                {chart.children}
              </TabsContent>
            )
          })}
        </Tabs>
      </Card>
    </>
  )
}
