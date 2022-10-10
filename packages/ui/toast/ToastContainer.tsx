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
      bodyClassName={() =>
        'mx-4 flex flex-col bg-dark-700 ring-1 ring-black/20 bg-slate-800 shadow-md mt-4 md:mt-2 rounded-xl overflow-hidden'
      }
      toastClassName={() => ''}
      className={className}
    />
  )
}
