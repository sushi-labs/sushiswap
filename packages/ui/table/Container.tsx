import { FC } from 'react'

const Container: FC = ({ children }) => (
  <div className="overflow-hidden overflow-x-auto border shadow-md bg-dark-900 border-dark-800 rounded-2xl shadow-dark-1000">
    {children}
  </div>
)

export default Container
