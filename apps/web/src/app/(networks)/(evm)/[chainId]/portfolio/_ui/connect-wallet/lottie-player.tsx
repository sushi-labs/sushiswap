import { classNames } from '@sushiswap/ui'
import Lottie from 'lottie-react'

export const LottiePlayer = ({
  animationData,
  className,
}: { animationData: object; className?: string }) => {
  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      className={classNames(className)}
      aria-label="Decorative sushi animation"
      role="img"
    />
  )
}
