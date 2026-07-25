import { classNames } from '@sushiswap/ui'

const GRADIENTS = [
  ['#f43f5e', '#fb7185'],
  ['#2563eb', '#60a5fa'],
  ['#7c3aed', '#c084fc'],
  ['#059669', '#34d399'],
  ['#ea580c', '#fbbf24'],
  ['#0891b2', '#22d3ee'],
] as const

export function TokenAvatar({
  symbol,
  size = 'md',
}: {
  symbol: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const gradient =
    GRADIENTS[
      [...symbol].reduce(
        (total, character) => total + character.charCodeAt(0),
        0,
      ) % GRADIENTS.length
    ]
  const label = symbol.slice(0, 2).toUpperCase()

  return (
    <div
      aria-label={`${symbol} token logo`}
      className={classNames(
        'shrink-0 rounded-full grid place-items-center text-white font-bold shadow-sm ring-1 ring-white/20',
        size === 'sm' && 'w-8 h-8 text-[10px]',
        size === 'md' && 'w-11 h-11 text-xs',
        size === 'lg' && 'w-14 h-14 text-sm',
        size === 'xl' && 'w-20 h-20 text-xl',
      )}
      style={{
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      {label}
    </div>
  )
}
