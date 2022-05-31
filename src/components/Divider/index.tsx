import { FC } from 'react'

interface DividerProps {
  className?: string
}

const Divider: FC<DividerProps> = ({ className = '' }) => {
  return <hr className={className ? className : 'border-dark-700'} />
}

export default Divider
