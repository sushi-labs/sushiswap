import Background from 'app/components/Background'
import Container, { MaxWidth } from 'app/components/Container'
import Footer from 'app/components/Footer'
import Header from 'app/components/Header'
import Main from 'app/components/Main'
import Popups from 'app/components/Popups'
import { Auction } from 'app/features/miso/context/Auction'
import { classNames, cloudinaryLoader } from 'app/functions'
import useDesktopMediaQuery from 'app/hooks/useDesktopMediaQuery'
import Image from 'next/image'
import React, { FC, ReactNode, useMemo } from 'react'

interface MisoHeaderProps extends React.HTMLProps<HTMLHeadElement> {
  className?: string
  pattern?: string
  maxWidth?: MaxWidth
  condensed?: boolean
  breadcrumb?: ReactNode
  auction?: Auction
}

export const MisoHeader: FC<MisoHeaderProps> = ({
  children,
  breadcrumb,
  className,
  maxWidth = '7xl',
  condensed,
  auction,
  ...props
}) => {
  const isDesktop = useDesktopMediaQuery()
  const background = useMemo(() => {
    if (isDesktop && auction?.auctionDocuments?.desktopBanner) {
      return (
        <>
          <Image
            alt={`${auction?.auctionInfo?.tokenInfo.name} banner`}
            src={cloudinaryLoader({ src: auction?.auctionDocuments?.desktopBanner, width: 1280, height: 196 })}
            width={1280}
            height={196}
            objectFit="cover"
            objectPosition="center"
            layout="fill"
            priority
          />
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-dark-900/60 filter backdrop-blur-[5px]" />
        </>
      )
    } else if (!isDesktop && auction?.auctionDocuments?.mobileBanner) {
      return (
        <>
          <Image
            alt={`${auction?.auctionInfo?.tokenInfo.name} banner`}
            src={cloudinaryLoader({ src: auction?.auctionDocuments?.mobileBanner, width: 768, height: 360 })}
            width={768}
            height={360}
            objectFit="cover"
            objectPosition="center"
            layout="fill"
            priority
          />
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-dark-900/60 filter backdrop-blur-[5px]" />
        </>
      )
    }
    return <Background variant="miso-bowl" />
  }, [
    auction?.auctionDocuments?.desktopBanner,
    auction?.auctionDocuments?.mobileBanner,
    auction?.auctionInfo?.tokenInfo.name,
    isDesktop,
  ])

  return (
    <header
      {...props}
      className={classNames('relative w-full bg-opacity-80 flex flex-col items-center shadow-md h-full', className)}
    >
      {background}
      <Container
        maxWidth={maxWidth}
        className={classNames(
          'flex flex-col gap-5 z-[1] py-10 px-5 lg:px-6',
          condensed && 'py-5',
          breadcrumb ? '!pt-4' : ''
        )}
      >
        {breadcrumb}
        {children}
      </Container>
    </header>
  )
}

interface MisoBodyProps {
  className?: string
  maxWidth?: MaxWidth
}

export const MisoBody: FC<MisoBodyProps> = ({ children, className, maxWidth = '7xl' }) => {
  return (
    <Main>
      <Container maxWidth={maxWidth} className={classNames('flex flex-col gap-10 py-10 px-5 lg:px-6 z-[1]', className)}>
        {children}
      </Container>
    </Main>
  )
}

const MisoLayout: FC = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col items-center w-full flex flex-grow">
        <div className="w-full flex-grow flex flex-col">{children}</div>
        <Popups />
      </div>
      <Footer />
    </div>
  )
}

export default MisoLayout
