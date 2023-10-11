import { BentoBoxKpis } from './components/BentoBoxKpis'

export default function BentoBoxPage() {
  return (
    <div className="max-w-full px-4 py-12 mx-auto sm:px-6 lg:px-8">
      <p className="text-5xl font-semibold  text-slate-50">BentoBox KPIs</p>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Cross Chain BentoBox Kpis
        </h3>
        <BentoBoxKpis />
      </div>
    </div>
  )
}
