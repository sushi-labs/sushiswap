import { classNames } from '@sushiswap/ui'

export const AccountManagement = ({ className }: { className?: string }) => {
  return (
    <div className={classNames('bg-green-500/50 border', className ?? '')}>
      Deposits and withdrawals/ account details
    </div>
  )
}
