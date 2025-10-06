'use client'
import { MinimumReceive } from './minimum-receive'
import { RemoveButton } from './remove-button'
import { RemoveInput } from './remove-input'

export const RemoveLiquidity = () => {
  return (
    <div className="flex flex-col gap-4">
      <RemoveInput />
      <MinimumReceive />
      <RemoveButton variant="outline" fullWidth />
    </div>
  )
}
