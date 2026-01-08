import { ArrowRightIcon } from '@heroicons/react-v1/outline'
import { Button, Card, LinkInternal } from '@sushiswap/ui'
import Image from 'next/image'

export const NoPointsState = () => {
  return (
    <Card>
      <div className="px-6 py-8 gap-6 flex justify-center md:justify-between items-center flex-col md:flex-row">
        <div className="flex md:gap-2 md:flex-row items-center flex-col">
          <Image
            src="/leaderboard-token.png"
            alt="Leaderboard Token"
            width={60}
            height={60}
            unoptimized
          />
          <div className="flex flex-col text-center md:text-left">
            <h3 className="font-bold text-2xl">Start Your Journey</h3>
            <p className="text-sm text-muted-foreground">
              Make your first trade to start earning points and join the
              leaderboard!
            </p>
          </div>
        </div>
        <LinkInternal href="/swap">
          <Button size="lg" icon={ArrowRightIcon} iconPosition="end">
            Make Your First Trade
          </Button>
        </LinkInternal>
      </div>
    </Card>
  )
}
