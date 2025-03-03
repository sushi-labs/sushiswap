'use client'

import { getTokenPriceChart } from '@sushiswap/graph-client/data-api/queries'
import { useIsMounted } from '@sushiswap/hooks'
import format from 'date-fns/format'
import ReactEcharts from 'echarts-for-react'
import echarts from 'echarts/lib/echarts'
import { useTheme } from 'next-themes'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { formatUSD } from 'sushi/format'

type TimeRange = '1D' | '1W' | '1M' | '1Y'
type ApiTimeRange = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'

interface PriceChartProps {
  address?: string
  symbol?: string
  chainId?: number
}

export const PriceChart: FC<PriceChartProps> = ({ address, chainId }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1W')
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [chartData, setChartData] = useState<[number, number][]>([])
  const [yAxisMin, setYAxisMin] = useState<number | undefined>(undefined)
  const [yAxisMax, setYAxisMax] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [firstPrice, setFirstPrice] = useState<number>(0)
  const isMounted = useIsMounted()
  const { resolvedTheme } = useTheme()

  // Map UI time range to API time range
  const getApiTimeRange = useCallback((range: TimeRange): ApiTimeRange => {
    switch (range) {
      case '1D':
        return 'DAY'
      case '1W':
        return 'WEEK'
      case '1M':
        return 'MONTH'
      case '1Y':
        return 'YEAR'
      default:
        return 'WEEK'
    }
  }, [])

  useEffect(() => {
    const fetchChartData = async () => {
      if (!chainId || !address) return

      setIsLoading(true)
      try {
        const apiTimeRange = getApiTimeRange(selectedRange)
        const data = await getTokenPriceChart({
          chainId: chainId as any, // Type assertion to handle the chainId type
          address: address.toLowerCase() as `0x${string}`,
          duration: apiTimeRange,
        })

        if (data && data.length > 0) {
          // Transform API data to chart format [timestamp, price]
          const formattedData: [number, number][] = data.map((point) => [
            point.timestamp * 1000, // Convert to milliseconds
            point.close,
          ])

          setChartData(formattedData)

          // Set current price to the latest close price
          const latestPrice = data[data.length - 1].close
          setCurrentPrice(latestPrice)

          // Store first price for hover calculations
          const initialPrice = data[0].close
          setFirstPrice(initialPrice)

          // Calculate price change percentage
          const priceChangePercent =
            ((latestPrice - initialPrice) / initialPrice) * 100
          setPriceChange(Number.parseFloat(priceChangePercent.toFixed(2)))

          // Calculate Y-axis min and max for better visualization
          // Find min and max values in the data
          const prices = data.map((point) => point.close)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)

          // Calculate a good range that shows price movements well
          // Use a percentage of the price range to create padding
          const range = maxPrice - minPrice
          const padding = range * 0.1 // 10% padding

          // Set min and max with padding, but don't go below 0 for min
          setYAxisMin(Math.max(0, minPrice - padding))
          setYAxisMax(maxPrice + padding)
        }
      } catch (error) {
        console.error('Error fetching token chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [chainId, address, selectedRange, getApiTimeRange])

  const onChartHover = useCallback(
    (params: { data: number[] }[]) => {
      const priceNode = document.getElementById('hoveredPrice')
      const dateNode = document.getElementById('hoveredDate')
      const diffNode = document.getElementById('hoveredPriceDiff')

      const hoveredPrice = params[0].data[1]

      if (priceNode) priceNode.innerHTML = formatUSD(hoveredPrice)
      if (dateNode)
        dateNode.innerHTML = format(
          new Date(params[0].data[0]),
          'dd MMM yyyy HH:mm aa',
        )

      // Calculate and display price difference on hover
      if (diffNode && firstPrice > 0) {
        const priceDiff = hoveredPrice - firstPrice
        const priceDiffPercent = (priceDiff / firstPrice) * 100
        const formattedPercent = priceDiffPercent.toFixed(2)
        const isPositive = priceDiff >= 0

        diffNode.innerHTML = `${isPositive ? '+' : ''}${formattedPercent}%`
        diffNode.className = `text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`
        diffNode.style.display = 'block'
      }
    },
    [firstPrice],
  )

  const onChartMouseLeave = useCallback(() => {
    const priceDisplay = document.getElementById('hoveredPrice')
    const dateDisplay = document.getElementById('hoveredDate')
    const diffDisplay = document.getElementById('hoveredPriceDiff')

    if (priceDisplay) {
      priceDisplay.innerText = formatUSD(currentPrice)
    }

    if (dateDisplay) {
      dateDisplay.innerText = format(new Date(), 'MMM dd yyyy HH:mm aa')
    }

    // Reset price difference display to show overall change
    if (diffDisplay) {
      diffDisplay.innerHTML = `${priceChange >= 0 ? '+' : ''}${priceChange}%`
      diffDisplay.className = `text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`
    }
  }, [currentPrice, priceChange])

  const chartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        formatter: onChartHover,
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color:
            resolvedTheme === 'dark'
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(0, 0, 0, 0.5)',
          formatter: (value: number) => {
            const date = new Date(value)
            if (selectedRange === '1D') {
              return format(date, 'HH:mm')
            } else if (selectedRange === '1W') {
              return format(date, 'EEE')
            } else {
              return format(date, 'MMM dd')
            }
          },
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        position: 'right',
        min: yAxisMin,
        max: yAxisMax,
        scale: true,
        axisLabel: {
          color:
            resolvedTheme === 'dark'
              ? 'rgba(255, 255, 255, 0.5)'
              : 'rgba(0, 0, 0, 0.5)',
          formatter: (value: number) => {
            // Format based on the value range
            if (value >= 1000) {
              return `$${(value / 1000).toFixed(1)}k`
            } else if (value >= 1) {
              return `$${value.toFixed(1)}`
            } else {
              return `$${value.toFixed(4)}`
            }
          },
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          data: chartData,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: '#3B82F6',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color:
                  resolvedTheme === 'dark'
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(59, 130, 246, 0.5)',
              },
              {
                offset: 1,
                color:
                  resolvedTheme === 'dark'
                    ? 'rgba(59, 130, 246, 0.05)'
                    : 'rgba(59, 130, 246, 0.05)',
              },
            ]),
          },
        },
      ],
    }),
    [chartData, onChartHover, selectedRange, resolvedTheme, yAxisMin, yAxisMax],
  )

  return (
    <div className="w-full">
      {/* Top row with price and time selector */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold" id="hoveredPrice">
              {isLoading ? 'Loading...' : formatUSD(currentPrice)}
            </div>
            {!isLoading && (
              <div
                id="hoveredPriceDiff"
                className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
              >
                {priceChange >= 0 ? '+' : ''}
                {priceChange}%
              </div>
            )}
          </div>
          <div
            className="text-sm text-gray-500 dark:text-slate-400"
            id="hoveredDate"
          >
            {isMounted ? format(new Date(), 'MMM dd yyyy, h:mm a') : ''}
          </div>
        </div>

        <div className="flex items-center">
          {(['1D', '1W', '1M', '1Y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setSelectedRange(range)}
              className={`text-sm px-3 py-2 ${
                selectedRange === range
                  ? 'text-blue-500 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <ReactEcharts
          option={chartOptions}
          echarts={echarts}
          style={{ height: 300 }}
          onEvents={{
            globalout: onChartMouseLeave,
          }}
          notMerge={true}
        />
      )}
    </div>
  )
}
