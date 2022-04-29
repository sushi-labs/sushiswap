import { FC } from 'react'

type Props = {
  children?: React.ReactNode
}

const Container: FC = ({ children }: Props) => (
  <div className="overflow-hidden overflow-x-auto border shadow-md bg-dark-900 border-dark-800 rounded-2xl shadow-dark-1000">
    {children}
  </div>
)

export default Container
