import { FC } from 'react'

const Container: FC = ({ children }) => (
  <div className="overflow-x-auto bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-md shadow-dark-1000">
    {children}
  </div>
)

export default Container
