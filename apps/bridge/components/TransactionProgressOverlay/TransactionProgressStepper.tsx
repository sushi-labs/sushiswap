import { FC } from 'react'

import { TransactionProgressBridgeStargate } from './TransactionProgressBridgeStargate'
import { TransactionProgressDestination } from './TransactionProgressDestination'
import { TransactionProgressSource } from './TransactionProgressSource'

export const TransactionProgressStepper: FC<{ onClose(): void }> = ({ onClose }) => {
  return (
    <div className="flex flex-col">
      <TransactionProgressSource>
        {({ isPrevLoading, isPrevSuccess, isPrevError }) => (
          <TransactionProgressBridgeStargate
            isPrevError={isPrevError}
            isPrevLoading={isPrevLoading}
            isPrevSuccess={isPrevSuccess}
          >
            {({ isPrevLoading, isPrevSuccess, isPrevError }) => (
              <TransactionProgressDestination
                isPrevError={isPrevError}
                isPrevLoading={isPrevLoading}
                isPrevSuccess={isPrevSuccess}
                onClose={onClose}
              />
            )}
          </TransactionProgressBridgeStargate>
        )}
      </TransactionProgressSource>
    </div>
  )
}
