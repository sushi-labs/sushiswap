import type { ReactNode } from 'react'

export interface ChartEntry {
  activeLiquidity: number
  price0: number
  price1?: number // Optional if not used
  tick?: number
  amount0Locked?: number
  amount1Locked?: number
}

interface Dimensions {
  width: number
  height: number
}

interface Margins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ZoomLevels {
  initialMin: number
  initialMax: number
  min: number
  max: number
}

export interface LiquidityChartRangeInputProps {
  // to distinguish between multiple charts in the DOM
  id?: string

  data: {
    series: ChartEntry[]
    current: number
  }
  priceRange: number | undefined

  styles: {
    area: {
      // color of the ticks in range
      selection: string
      opacity?: number
    }

    brush: {
      handle: {
        west: string
        east: string
      }
    }
  }

  dimensions: Dimensions
  margins: Margins

  interactive?: boolean

  brushLabels: (d: 'w' | 'e', x: number) => string
  brushDomain?: [number, number]
  onBrushDomainChange: (
    domain: [number, number],
    mode: string | undefined,
  ) => void

  getNewRangeWhenBrushing: (
    range: [number, number],
    movingHandle: HandleType | undefined,
  ) => [number, number] | undefined

  zoomLevels: ZoomLevels
  hideBrushes?: boolean

  tokenToggle?: ReactNode
}

export enum HandleType {
  e = 'e',
  w = 'w',
}
