import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer as ToastifyContainer } from 'react-toastify'

export const ToastContainer = () => {
  return (
    <ToastifyContainer
      newestOnTop
      bodyClassName={() =>
        'flex flex-col bg-dark-800 ring-1 ring-black/10 bg-slate-800 shadow-md mt-2 rounded-xl overflow-hidden'
      }
      toastClassName={() => ''}
    />
  )
}
