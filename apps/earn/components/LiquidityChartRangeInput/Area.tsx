import { usePrevious } from '@sushiswap/hooks'
import { area, curveStepAfter, ScaleLinear, select, Series } from 'd3'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import filterTicksLiquidityData from 'utils/filterTicksLiquidityData'

interface AnimatedPathProps {
  animate?: boolean
  d: any
  fill?: string
  hidden?: boolean
}

const AnimatedPath: FC<AnimatedPathProps> = ({ animate, d, fill, hidden }) => {
  const ref = useRef<SVGPathElement>(null)
  const [didMount, setDidMount] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const element = select(ref.current)
    if (!animate || !didMount) {
      element.attr('d', d)
      element.style('opacity', hidden ? 0 : 1)
      if (!didMount) setDidMount(true)
      return
    }
    element
      .transition()
      .attr('d', d)
      .style('opacity', hidden ? 0 : 1)
    // cleanup by ending transitions
    return () => {
      element.interrupt()
    }
  }, [didMount, d, animate, hidden])

  return <path opacity={0.5} stroke={fill ?? 'currentColor'} className="text-blue" ref={ref} fill={fill} />
}

interface AreaProps {
  stackedData: Series<{ [key: string]: number }, string>[]
  selectedKeyIndex?: number
  hiddenKeyIndexes: number[]
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  colors: (string | undefined)[]
}

export const Area: FC<AreaProps> = ({ stackedData, selectedKeyIndex, hiddenKeyIndexes, xScale, yScale, colors }) => {
  const previousSelectedKeyIndex = usePrevious(selectedKeyIndex)
  const previousXScale = usePrevious(xScale)

  return useMemo(
    () => (
      <>
        {stackedData.map((data, index) => {
          const iterator = filterTicksLiquidityData(data, xScale)
          return (
            <AnimatedPath
              fill={colors[index % colors.length]}
              key={data.key}
              animate={previousSelectedKeyIndex === selectedKeyIndex && previousXScale === xScale}
              hidden={hiddenKeyIndexes.includes(index)}
              d={
                (iterator &&
                  area()
                    .curve(curveStepAfter)
                    .x((d: any) => xScale(d.data.price0))
                    .y0((d: any) => yScale(d[0]))
                    .y1((d: any) => yScale(d[1]))(iterator)) ??
                undefined
              }
            />
          )
        })}
      </>
    ),
    [stackedData, colors, previousSelectedKeyIndex, selectedKeyIndex, previousXScale, xScale, hiddenKeyIndexes, yScale]
  )
}
