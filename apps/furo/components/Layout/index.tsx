import { FC } from 'react'
import Container from 'ui/container/Container'
import Glow from 'ui/glow/Glow'
import { classNames } from 'ui/lib/classNames'

const Layout: FC = ({ children }) => {
  return (
    <Container maxWidth="5xl" className="px-2 lg:mx-auto">
      <div className={classNames('absolute inset-0 flex flex-col items-center bg-dark-900/30')}>
        <div className={classNames('absolute inset-0 w-full h-full z-0 opacity-30', 'bg-circuit')} />
      </div>
      <Glow>{children}</Glow>
    </Container>
  )
}

export default Layout
