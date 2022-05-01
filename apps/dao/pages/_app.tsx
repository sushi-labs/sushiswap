import { FC } from 'react'
import type { AppProps } from 'next/app'

import { App, classNames, Container } from '@sushiswap/ui'

import '@sushiswap/ui/index.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  return (
    <App.Shell>
      <App.Nav>
        <Container maxWidth="7xl" className="flex justify-between pt-8 mx-auto">
          <div className="font-bold">Sushi DAO</div>
          <div className="flex space-x-4 ">
            {['/safes', '/team'].map((href, i) => (
              <Link key={i} href={href}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  className={classNames(
                    'text-gray-400 hover:text-white hover:underline focus:text-white active:text-white',
                    router.asPath === href && '!text-white !underline',
                  )}
                >
                  {href.slice(1, href.length).charAt(0).toUpperCase()}
                  {href.slice(2)}
                </a>
              </Link>
            ))}
          </div>
        </Container>
      </App.Nav>
      <Component {...pageProps} />
      <App.Footer />
    </App.Shell>
  )
}

export default MyApp
