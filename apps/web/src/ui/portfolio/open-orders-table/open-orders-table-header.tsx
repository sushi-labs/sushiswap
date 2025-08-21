import { OpenOrdersTotal } from './open-orders-total'

export const OpenOrdersTableHeader = () => {
  return (
    <div className="px-4 py-6  gap-4 flex flex-wrap flex-col md:flex-row md:items-center justify-between">
      <OpenOrdersTotal />
    </div>
  )
}
