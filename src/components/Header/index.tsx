import Mobile from 'app/components/Header/Mobile'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import React, { FC } from 'react'

import Desktop from './Desktop'

const Header: FC = () => {
  const isDesktop = useDesktopMediaQuery()

  return <>{isDesktop ? <Desktop /> : <Mobile />}</>
}

export default Header
