import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { scaleLinear } from '@visx/scale'
import { Bar, LinePath } from '@visx/shape'
// @ts-ignore TYPE NEEDS FIXING
import { bisector } from 'd3-array'
import { FC, MouseEvent, TouchEvent, useRef } from 'react'
import { useCallback, useMemo } from 'react'
// @ts-ignore TYPE NEEDS FIXING
import AutoSizer from 'react-virtualized-auto-sizer'

interface LineGraphProps {
  data: {
    x: number
    y: string
  }[]
  stroke?:
    | {
        solid: string
      }
    | {
        gradient: {
          from: string
          to: string
        }
      }
  strokeWidth?: number
  setSelectedIndex?: (x: number) => void
}

interface GraphProps extends LineGraphProps {
  width: number
  height: number
}

// @ts-ignore TYPE NEEDS FIXING
const bisect = bisector((d) => d.x).center

const Graph: FC<GraphProps> = ({ data, stroke, strokeWidth, width, height, setSelectedIndex }) => {
  const dRef = useRef<number>()
  const circleRef = useRef<SVGCircleElement>()
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        // @ts-ignore
        domain: [Math.min(data[0]?.x, data[data.length - 1]?.x), Math.max(data[0]?.x, data[data.length - 1]?.x)],
        range: [10, width - 10],
      }),
    [data, width]
  )

  const yScale = useMemo(() => {
    const y = data.map((el) => el.y)
    return scaleLinear<number>({
      // @ts-ignore
      domain: [Math.max.apply(Math, y), Math.min.apply(Math, y)],
      range: [10, height - 10],
    })
  }, [data, height])

  const handleTooltip = useCallback(
    (event: TouchEvent<SVGRectElement> | MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = xScale.invert(x)
      const index = bisect(data, x0, 0)
      const d = data[index]

      // Add check to avoid unnecessary changes and setState to DOM
      if (d && dRef.current !== index) {
        dRef.current = index
        // @ts-ignore TYPE NEEDS FIXING
        circleRef.current.setAttribute('cx', xScale(d.x).toString())
        // @ts-ignore TYPE NEEDS FIXING
        circleRef.current.setAttribute('cy', yScale(d.y).toString())
        // @ts-ignore TYPE NEEDS FIXING
        setSelectedIndex(index)
      }
    },
    [data, setSelectedIndex, xScale, yScale]
  )

  const showTooltip = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    circleRef.current.setAttribute('display', 'block')
  }, [])

  const hideTooltip = useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    setSelectedIndex(data.length - 1)
    // @ts-ignore TYPE NEEDS FIXING
    circleRef.current.setAttribute('display', 'none')
  }, [data, setSelectedIndex])

  return (
    <div className="w-full h-full">
      <svg width={width} height={height}>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {'gradient' in stroke && (
          <LinearGradient id="gradient" from={stroke.gradient.from} to={stroke.gradient.to} vertical={false} />
        )}
        {setSelectedIndex && (
          <g>
            {/*@ts-ignore TYPE NEEDS FIXING*/}
            <circle ref={circleRef} r={4} fill={'solid' in stroke ? stroke.solid : '#ffffff'} display="none" />
          </g>
        )}
        <LinePath
          data={data}
          // @ts-ignore
          x={(d) => xScale(d.x) ?? 0}
          // @ts-ignore
          y={(d) => yScale(d.y) ?? 0}
          // @ts-ignore TYPE NEEDS FIXING
          stroke={'solid' in stroke ? stroke.solid : "url('#gradient')"}
          strokeWidth={strokeWidth}
        />
        <Bar
          width={width}
          height={height}
          fill={'transparent'}
          {...(setSelectedIndex && {
            onTouchStart: handleTooltip,
            onTouchMove: handleTooltip,
            onMouseEnter: showTooltip,
            onMouseMove: handleTooltip,
            onMouseLeave: hideTooltip,
          })}
        />
      </svg>
    </div>
  )
}

const LineGraph: FC<LineGraphProps> = ({
  data,
  stroke = { solid: '#0993EC' },
  strokeWidth = 1.5,
  setSelectedIndex,
}) => {
  if (data)
    return (
      <AutoSizer>
        {/*@ts-ignore TYPE NEEDS FIXING*/}
        {({ width, height }) => <Graph {...{ data, stroke, strokeWidth, width, height, setSelectedIndex }} />}
      </AutoSizer>
    )

  return <></>
}

export default LineGraph
