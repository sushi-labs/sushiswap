import { transformRouteToSankeyLegend } from '../helpers'
import { Route, SourceLegendType } from '../../../../types'
import { sankeyLegendContainerClass } from './index.css'

interface SankeyLegendProps {
  route: Route | null
}
export const SankeyLegend = ({ route }: SankeyLegendProps) => {
  const legendData = route ? transformRouteToSankeyLegend({ route }) : []

  return (
    <div className={sankeyLegendContainerClass}>
      {legendData.map((source: SourceLegendType) => {
        return (
          <div key={source.source} className={sankeyLegendContainerClass}>
            <div
              style={{
                width: '12px',
                height: '12px',
                background: `linear-gradient(${source.gradient?.start}, ${source.gradient?.end})`,
                marginRight: '8px',
                borderRadius: '3px',
              }}
            />
            <span style={{ marginRight: '12px' }}>
              {source.source.replaceAll('_', ' ')}
            </span>
          </div>
        )
      })}
    </div>
  )
}
