import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  LinkExternal,
} from '@sushiswap/ui'
import { DownTriangleIcon } from '@sushiswap/ui/icons/DownTriangleIcon'
import { formatUSD } from 'sushi'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { DEFAULT_TIERS } from './overview'

const FAQ_ITEMS = [
  {
    title: 'What are Sushi Points?',
    value: '1',
    content:
      'Sushi points are earned by trading perps on Sushi during Season 1. At the end of Season 1, points convert into SUSHI tokens through the airdrop. The more you trade and the higher your tier, the bigger your airdrop allocation.',
  },
  {
    title: 'How do I earn points?',
    value: '2',
    content: `Points are earned through trading volume on Sushi Perps. Every trade you make contributes to your points balance. Both opens and closes count. There's no cap on point distribution — points are calculated based on your total volume traded.`,
  },
  {
    title: 'What are tiers?',
    value: '3',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Tiers are status levels you climb by trading volume. Each tier comes
          with a points multiplier that locks in for the entire season. Once you
          reach a tier, the multiplier stays with you through the end of Season
          1.
        </p>
        <p>The tier ladder:</p>
        {DEFAULT_TIERS.map((tier) => (
          <div key={tier.id} className="flex items-center gap-1 text-white">
            <div className="w-3 h-3">{tier.simpleIcon}</div>
            <div>
              {tier.label}
              {tier.volumeUsdThreshold > 0
                ? `: ${formatUSD(tier.volumeUsdThreshold).replace('.00', '').replace('m', 'M')}+ volume (${tier.multiplier}x multiplier)`
                : ' - entry level'}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'How do multipliers work?',
    value: '4',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Your multiplier locks in once you hit a tier and stays locked for all
          of Season 1. Your points are multiplied by your tier multiplier live
          as you earn them, so climbing tiers early in the season maximizes your
          points growth.
        </p>
        <p>
          Example: You earn 100,000 points during Season 1 (not including the
          multiplier) and end the season at Samurai tier (1.6x). Your final
          balance for airdrop calculation is 160,000 points.
        </p>
      </div>
    ),
  },
  {
    title: 'How do I check my points and tier?',
    value: '5',
    content: (
      <p>
        Connect your wallet to the{' '}
        <LinkExternal href="https://sushi.com/perps/points">
          Sushi Perps Points Dashboard
        </LinkExternal>
        . You'll see your current tier, multiplier, points accrued, and progress
        toward the next tier.
      </p>
    ),
  },
  {
    title: 'Do referrals earn me points?',
    value: '6',
    content: (
      <p>
        No. Referrals earn you fee share — 20% of your traders' fees, paid in
        USDC in real time. Trading volume is the only thing that earns points
        and climbs tiers. Referrals and points are two separate earning systems
        that run in parallel.
      </p>
    ),
  },
  {
    title: 'Why should I care about points and tiers?',
    value: '7',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          Points convert directly into SUSHI tokens at the end of Season 1 (July
          31, 2026). The higher your tier, the bigger your multiplier on total
          points. Traders who climb tiers early have the entire season's accrual
          multiplied at their locked-in rate.
        </p>
        <p>
          The system rewards both volume and timing. Trade more, climb higher,
          lock in earlier.
        </p>
      </div>
    ),
  },
  {
    title: "What's the SUSHI airdrop pool size?",
    value: '8',
    content: (
      <div className="flex flex-col gap-2">
        <p>
          The airdrop pool scales with Season 1 participation. There's no hard
          cap on points distribution every dollar of volume contributes to the
          total pool, and the goal of Season 1 is to grow Sushi Perps as the
          airdrop scales with it.
        </p>
        <p>
          Final pool size and per-point conversion will be announced before the
          snapshot.
        </p>
      </div>
    ),
  },
  {
    title: 'How are points converted to SUSHI at the airdrop?',
    value: '9',
    content: (
      <p>
        Points will result in $SUSHI rewards at a conversion rate to be
        determined at a future date by Sushi Core team.
      </p>
    ),
  },
  {
    title: 'When does Season 1 end?',
    value: '10',
    content: <p>Season 1 will end on July 31, 2026.</p>,
  },
  {
    title: 'When and how do I claim my SUSHI?',
    value: '11',
    content: (
      <p>
        You will be able to claim your SUSHI rewards on July 31st. The claim
        window will be live for 30 days.
      </p>
    ),
  },
  {
    title: 'Do points expire?',
    value: '12',
    content: (
      <p>
        Points earned in Season 1 are valid for the Season 1 airdrop only. They
        do not expire before July 31, 2026, but they do not roll over into any
        future season. If new seasons launch after this one, they start with
        fresh point balances.
      </p>
    ),
  },
  {
    title: 'Are points retroactive?',
    value: '13',
    content: (
      <p>
        No. Points accrual started on the day Sushi Perps launched. Earlier
        activity on{' '}
        <LinkExternal href="https://sushi.com">sushi.com</LinkExternal> does not
        retroactively earn points.
      </p>
    ),
  },
  {
    title: 'Is there a minimum trading threshold to qualify?',
    value: '14',
    content: (
      <p>
        No. You start earning points on your first trade. The Deshi tier is your
        entry level; any trade, any size, gets you started.
      </p>
    ),
  },
  {
    title: 'What about wash trading or self-trading?',
    value: '15',
    content: (
      <p>
        Wash trading, self-trading, and other manipulative activity intended to
        inflate points are prohibited and may result in disqualification from
        the Season 1 airdrop. Points are designed to reward real trading
        activity that contributes to platform growth.
      </p>
    ),
  },
  {
    title: 'What happens if I use multiple wallets?',
    value: '16',
    content: (
      <p>
        Points are tracked per wallet. Each wallet earns its own points based on
        its own trading volume and climbs its own tier independently.
      </p>
    ),
  },
  {
    title: 'Disclaimers',
    value: '17',
    content: (
      <p>
        The Sushi points program is subject to change. Sushi reserves the right
        to modify points calculation, multiplier mechanics, distribution
        methodology, and eligibility criteria at any time. The airdrop is not a
        guaranteed financial product and should not be treated as investment
        advice. Participation is voluntary and at your own risk. By
        participating, you agree to the program terms.
      </p>
    ),
  },
]

export const FaqSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12">
      <div>
        <h4 className="text-xl text-white font-medium">Why Points Matter?</h4>
        <p className="text-sm text-perps-muted-50 mt-2">
          Trade on Sushi Perps and earn Points based on the volume you generate
          every season. Hit volume milestones to increase your multiplier{' '}
          <span className="text-[#C26BB3]">(up to 2.0x)</span> and earn Points
          faster. Higher tiers and more Points improve your access to seasonal
          rewards, campaigns, and future distributions.
        </p>
      </div>
      <div className="flex flex-col">
        <Accordion
          type="multiple"
          defaultValue={['1']}
          className="flex flex-col gap-1"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="!border-0"
              defaultChecked={item.value === '1'}
            >
              <PerpsCard className="p-3">
                <AccordionTrigger
                  className="!p-0 hover:no-underline"
                  customIcon={
                    <DownTriangleIcon className="h-2 w-2 shrink-0 transition-transform duration-200" />
                  }
                >
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-perps-muted-50 mt-2">
                  {item.content}
                </AccordionContent>
              </PerpsCard>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
