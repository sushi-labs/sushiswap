import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="px-2 py-2 bg-neutral-900 sm:px-8 sm:py-4">
        <div className="max-w-screen-lg px-4 py-12 mx-auto sm:px-6 lg:py-16 lg:px-8">
          <h2 className="sr-only">Footer</h2>
          <div className="w-full">
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
              <div className="col-span-2 pt-2 sm:pt-4 sm:col-span-1 md:col-span-2 sm:pr-16">
                <div className="flex items-center">
                  <Link href="/" passHref aria-label="Home">
                    <Image
                      width={40}
                      height={40}
                      className="w-auto max-h-8 sm:max-h-10"
                      src="/logo.png"
                      alt="Logo"
                      unoptimized
                    />
                  </Link>
                  <Link href="/">
                    <a className="ml-2 text-xl font-bold leading-6 text-white sm:truncate">Sushi</a>
                  </Link>
                </div>
                <div className="mt-4 ml-2 text-sm text-gray-400">
                  Sushi is the home of DeFi. Our community is building a comprehensive, decentralized trading platform
                  for the future of finance. Join us!
                </div>
                <div className="flex mt-4 ml-2 space-x-6 md:order-2 ">
                  <a href="https://sushichef.medium.com/" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Medium</span>
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" clipRule="evenodd">
                      <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
                    </svg>
                  </a>
                  <a href="https://twitter.com/sushiswap" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://github.com/sushiswap" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">GitHub</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="items-start">
                <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Products</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="https://app.sushi.com/swap" aria-label="Swap">
                      <a href="https://app.sushi.com/swap" className="text-base text-gray-400 hover:text-white">
                        Swap
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://app.sushi.com/limit-order" aria-label="Limit Order">
                      <a href="https://app.sushi.com/limit-order" className="text-base text-gray-400 hover:text-white">
                        Limit Order
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" aria-label="BentoBox Apps">
                      <a href="https://app.sushi.com/bentobox" className="text-base text-gray-400 hover:text-white">
                        BentoBox Dapps
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" aria-label="Lending">
                      <a href="https://app.sushi.com/lend" className="text-base text-gray-400 hover:text-white">
                        Kashi Lending
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" aria-label="Borrowing">
                      <a href="https://app.sushi.com/borrow" className="text-base text-gray-400 hover:text-white">
                        Kashi Borrow
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a href="https://docs.sushipro.io/" className="text-base text-gray-400 hover:text-white">
                      API
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="https://docs.sushi.com" className="text-base text-gray-400 hover:text-white">
                      Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="https://dev.sushi.com" className="text-base text-gray-400 hover:text-white">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="https://discord.gg/CD2YdZzb7Z" className="text-base text-gray-400 hover:text-white">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="https://forum.sushi.com" className="text-base text-gray-400 hover:text-white">
                      Forum
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Protocol</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="https://snapshot.org/#/sushi" className="text-base text-gray-400 hover:text-white">
                      Vote
                    </a>
                  </li>
                  <li>
                    <Link href="/" aria-label="Add Liquidity">
                      <a href="https://app.sushi.com/add/ETH" className="text-base text-gray-400 hover:text-white">
                        Create a Pair
                      </a>
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://forms.gle/dUpFdzZiJBYGPi2k8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-400 hover:text-white"
                    >
                      Register for Onsen
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
