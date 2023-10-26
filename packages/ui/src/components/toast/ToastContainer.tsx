import 'react-toastify/dist/ReactToastify.css'

import { FC } from 'react'
import { ToastContainer as ToastifyContainer } from 'react-toastify'

interface ToastContainer {
  className?: string
}

export const ToastContainer: FC<ToastContainer> = ({ className }) => {
  return (
    <ToastifyContainer
      newestOnTop
      bodyClassName={() => ''}
      toastClassName={() =>
        'mx-4 flex flex-col shadow-md bg-white/50 paper dark:bg-slate-800/50 mt-12 md:mt-2 rounded-xl overflow-hidden text-[color:var(--color)]'
      }
      className={className}
    />
  )
}
