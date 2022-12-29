import { FC, ReactNode } from 'react'

interface ToastContent {
  icon?: ReactNode
  title: string
  summary: ReactNode | Array<ReactNode>
  code?: boolean
}

export const ToastContent: FC<ToastContent> = ({ icon, title, summary, code = false }) => {
  return (
    <div className="p-4 flex gap-4 items-start">
      {icon && <div className="mt-0.5">{icon}</div>}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-50">{title}</span>
        {!code ? (
          <span className="text-xs text-slate-200">{summary}</span>
        ) : (
          <div className="scroll mt-2 bg-black/20 p-2 px-3 rounded-lg border border-slate-200/10 text-[10px] text-slate-200 break-all max-h-[80px] overflow-y-auto">
            <code>{summary}</code>
          </div>
        )}
      </div>
    </div>
  )
}
