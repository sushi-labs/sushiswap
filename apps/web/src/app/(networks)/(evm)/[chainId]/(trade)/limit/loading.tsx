import { CowLimitSkeleton } from './_ui/cow-limit-skeleton'

// Without this, navigating here falls back to the trade group's full splash.
export default function LimitLoading(): React.JSX.Element {
  return <CowLimitSkeleton />
}
