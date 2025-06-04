import { useQuickSelectContext } from './quick-select-provider'

export const QuickSelectOverlay = () => {
  const {
    state: { isOpen },
    mutate: { onValueChange },
  } = useQuickSelectContext()

  return (
    <div
      onClick={() => onValueChange(false)}
      onKeyDown={() => onValueChange(false)}
      className={`
        absolute inset-0 rounded-xl z-20
        bg-gray-100/70 dark:bg-slate-900/70
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    />
  )
}
