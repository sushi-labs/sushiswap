import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { Button, CardContent, CardHeader, classNames } from '@sushiswap/ui'
import animationLeft from 'public/animations/portfolio-sushi-left.json'
import animationRight from 'public/animations/portfolio-sushi-right.json'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
import { LottiePlayer } from './lottie-player'

export const ConnnectWallet = () => {
  return (
    <Wrapper className="!p-0" enableBorder>
      <CardHeader className="border-b !py-5">
        <Button
          iconPosition="end"
          icon={ChevronDownIcon}
          variant="outline"
          size="sm"
          className={classNames(
            'hover:dark:!bg-skyblue/20 hover:!bg-blue/20 hover:!text-blue hover:dark:!text-skyblue !gap-1 !w-fit !border-none !rounded-full',
          )}
        >
          <span>All Assets</span>
        </Button>
      </CardHeader>
      <CardContent className="relative flex items-center justify-center min-h-[500px] overflow-hidden">
        <LottiePlayer
          animationData={animationLeft}
          className="absolute left-0 lg:left-10 top-1/2 -translate-y-1/2 w-[50%] max-w-[525px]"
        />
        <ConnectButton
          variant="default"
          size="xl"
          className="min-w-[150px] sm:min-w-[240px] z-10"
        />
        <LottiePlayer
          animationData={animationRight}
          className="absolute right-0 lg:right-10 top-1/2 -translate-y-1/2 w-[50%] max-w-[525px]"
        />
      </CardContent>
    </Wrapper>
  )
}
