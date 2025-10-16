import { Chord, Ribbon } from '@visx/chord'
import { localPoint } from '@visx/event'
import { Group } from '@visx/group'
import { ParentSize } from '@visx/responsive'
import { Arc } from '@visx/shape'
import { Text } from '@visx/text'
import { useCallback, useState } from 'react'
import { formatUSD } from 'sushi'
import { BLADE_POOL_CHART_COLORS } from '../constants'
import { type ChordPairData, sortSubgroupsDescending } from './utils'

let tooltipTimeout: number

interface ChordDiagramProps {
  matrix: number[][]
  matrixProps: ChordPairData[][]
  segmentNames: string[]
  theme: string | undefined
  showTooltip: (args: {
    tooltipLeft: number
    tooltipTop: number
    tooltipData: ChordPairData
  }) => void
  hideTooltip: () => void
}

export function ChordDiagram({
  matrix,
  matrixProps,
  segmentNames,
  theme,
  showTooltip,
  hideTooltip,
}: ChordDiagramProps) {
  const [selectedRibbon, setSelectedRibbon] = useState<[number, number] | null>(
    null,
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent, chord: any) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout)
      const point = localPoint(event)
      if (!point) return

      const props = matrixProps[chord.source.index][chord.target.index]
      setSelectedRibbon([chord.source.index, chord.target.index])
      showTooltip({
        tooltipLeft: point.x,
        tooltipTop: point.y,
        tooltipData: props,
      })
    },
    [matrixProps, showTooltip],
  )

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip()
      setSelectedRibbon(null)
    }, 300)
  }, [hideTooltip])

  return (
    <div className="h-[400px] w-full">
      <ParentSize debounceTime={500}>
        {({ width, height: parentHeight }) => {
          if (!parentHeight || !width) return null

          const height = parentHeight - 10
          const centerSize = 20
          const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10)
          const innerRadius = outerRadius - centerSize

          return (
            <svg width={width} height={height}>
              <Group top={height / 2} left={width / 2}>
                <Chord
                  matrix={matrix}
                  padAngle={0.2}
                  sortSubgroups={sortSubgroupsDescending}
                >
                  {({ chords }) => (
                    <g>
                      {chords.map((chord, i) => {
                        const iIndex = chord.source.index
                        const jIndex = chord.target.index
                        let opacity = 0.75
                        if (
                          selectedRibbon &&
                          iIndex === selectedRibbon[0] &&
                          jIndex === selectedRibbon[1]
                        ) {
                          opacity = 1
                        } else if (selectedRibbon) {
                          opacity = 0.55
                        }

                        return (
                          <Ribbon
                            key={`ribbon-${i}`}
                            chord={chord}
                            radius={innerRadius}
                            fill={
                              BLADE_POOL_CHART_COLORS[
                                i % BLADE_POOL_CHART_COLORS.length
                              ]
                            }
                            fillOpacity={opacity}
                            onMouseMove={(e) => handleMouseMove(e, chord)}
                            onMouseLeave={handleMouseLeave}
                            onTouchMove={(e) => handleMouseMove(e, chord)}
                            onTouchEnd={handleMouseLeave}
                          />
                        )
                      })}
                      {chords.groups.map((group, i) => (
                        <Arc
                          key={`key-${i}`}
                          data={group}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          fill="#F5F5F5"
                        >
                          {({ path }) => {
                            const text = segmentNames[i]
                            const color =
                              theme === 'dark' ? '#242A3A' : '#F5F5F5'
                            const centroid = path.centroid(group)
                            const textWidth = text.length * 6 + 8
                            const textHeight = 16

                            return (
                              <>
                                <path
                                  d={path(group) ?? undefined}
                                  fill={color}
                                />
                                <rect
                                  x={centroid[0] - textWidth / 2}
                                  y={centroid[1] - textHeight / 2}
                                  width={textWidth}
                                  height={textHeight}
                                  fill="#737A87"
                                  rx={4}
                                  ry={4}
                                />
                                <Text
                                  fill="#ffffff"
                                  x={centroid[0]}
                                  y={centroid[1]}
                                  dy=".33em"
                                  fontSize={10}
                                  fontWeight={600}
                                  textAnchor="middle"
                                  pointerEvents="none"
                                >
                                  {text}
                                </Text>
                              </>
                            )
                          }}
                        </Arc>
                      ))}
                    </g>
                  )}
                </Chord>
              </Group>
            </svg>
          )
        }}
      </ParentSize>
    </div>
  )
}

export function TooltipContent({
  item,
}: {
  item: ChordPairData
}) {
  return (
    <div className="space-y-1">
      <div className="font-semibold">
        {item.asset0}/{item.asset1}
      </div>
      <div>Volume: {formatUSD(item.volumeUSD)}</div>
      <div>Swaps: {item.txCount}</div>
    </div>
  )
}
