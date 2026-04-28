import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react-v1/solid'

export const ShortcutMenu = () => {
  return (
    <div className="hidden lg:flex items-center gap-4 px-4 text-xs text-perps-muted-50 pb-2 pt-1">
      <div className="flex items-center gap-1">
        <div className="rounded-sm bg-perps-muted/[0.05] px-1">
          Enter (Return)
        </div>
        <div>Select Market</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded-sm bg-perps-muted/[0.05] px-1 h-4 flex items-center justify-center w-4">
          <ArrowUpIcon className="h-3 w-3" />
        </div>
        <div className="rounded-sm bg-perps-muted/[0.05] px-1 h-4 flex items-center justify-center w-4">
          <ArrowDownIcon className="h-3 w-3" />
        </div>
        <div>Navigate</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded-sm bg-perps-muted/[0.05] px-1">W</div>
        <div>Add to Watchlist</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="rounded-sm bg-perps-muted/[0.05] px-1">Esc</div>
        <div>Close</div>
      </div>
    </div>
  )
}
