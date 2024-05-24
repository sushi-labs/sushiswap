import { Squid as _Squid } from '@0xsquid/sdk'
import { SquidIntegratorId } from 'sushi/config'

export const Squid = new _Squid({
  baseUrl: 'https://apiplus.squidrouter.com/',
  integratorId: SquidIntegratorId,
})
