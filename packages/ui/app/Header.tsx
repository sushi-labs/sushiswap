import { FC } from 'react'

const Header: FC = ({ children }) => <header className="fixed z-20 hidden w-full h-16 lg:block">{children}</header>

export default Header
