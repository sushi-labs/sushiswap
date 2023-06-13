import { Bound } from '../../lib/constants'

export interface ChartEntry {
  activeLiquidity: number
  price0: number
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
  // to distringuish between multiple charts in the DOM
  id?: string

  data: {
    series: ChartEntry[]
    current: number
  }
  ticksAtLimit: { [bound in Bound]?: boolean | undefined }

  styles: {
    area: {
      // color of the ticks in range
      selection: string

      opacity?: number
    }
  }

  dimensions: Dimensions
  margins: Margins

  interactive?: boolean

  brush?: {
    brushLabels: (d: 'w' | 'e', x: number) => string
    brushDomain: [number, number] | undefined
    onBrushDomainChange: (domain: [number, number], mode: string | undefined) => void
    style: {
      handle: {
        west: string
        east: string
      }
    }
  }

  zoomLevels: ZoomLevels
}
