import { getReferralCodeAvailable } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { REFERRAL_REGEX } from '../exchange'

export function useIsSushiReferralAvailable({
  code,
}: {
  code: string
}) {
  return useQuery({
    queryKey: ['sushiReferralCodeAvailable', code],
    queryFn: async () => {
      if (!REFERRAL_REGEX.test(code)) {
        return false
      }

      return getReferralCodeAvailable({ code })
    },
    enabled: Boolean(REFERRAL_REGEX.test(code)),
  })
}
