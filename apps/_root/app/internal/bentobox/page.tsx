import { Typography } from '@sushiswap/ui/typography'
import { BentoBoxKpis } from './components/BentoBoxKpis'

export default function BentoBoxPage() {
  return (
    <div className="max-w-full px-4 py-12 mx-auto sm:px-6 lg:px-8">
      <Typography variant="hero" weight={600} className="text-slate-50">
        BentoBox KPIs
      </Typography>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Cross Chain BentoBox Kpis</h3>
        <BentoBoxKpis />
      </div>
    </div>
  )
}
