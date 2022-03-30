import { FC } from 'react'

interface KPIProps {
  label: string
  value: string
}

const KPI: FC<KPIProps> = ({ label, value }) => (
  <div className="w-full py-3 border px-9 border-[rgba(22,21,34,1)] rounded shadow-md bg-[rgba(0,0,0,0.12)]">
    <div className="whitespace-nowrap">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
)

export default KPI
