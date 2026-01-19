import { ReferralLink } from './referral-link'

export const Hero = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <span className="gap-3 flex flex-wrap">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue to-pink text-transparent bg-clip-text">
            SushiSwap
          </span>
          <span className="text-5xl font-bold">Referral Program</span>
        </span>
        <span className="text-xl max-w-[720px] text-muted-foreground">
          Refer frens and earn points on SushiSwap
        </span>
      </div>
      <div>
        <ReferralLink />
      </div>
    </div>
  )
}
