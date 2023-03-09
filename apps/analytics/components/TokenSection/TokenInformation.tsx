import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { CopyHelper, Currency, Link, Table, Typography } from '@sushiswap/ui'
import { FC } from 'react'

import { useTokenFromToken } from '../../lib/hooks'

interface TokenInformation {
  token: GraphToken
}

export const TokenInformation: FC<TokenInformation> = ({ token }) => {
  const _token = useTokenFromToken(token)
  const chain = Chain.from(_token.chainId) as Chain

  return (
    <div className="flex flex-col w-full gap-4">
      <Typography weight={600} className="text-slate-50">
        Token Information
      </Typography>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left">Symbol</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Name</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Address</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Action</div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            <Table.tr>
              <Table.td>
                <Typography weight={600} variant="sm" className="text-slate-100">
                  {_token.symbol}
                </Typography>
              </Table.td>
              <Table.td>
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={_token} width={24} height={24} />
                  <Typography weight={500} variant="sm" className="text-slate-100">
                    {_token.name}
                  </Typography>
                </div>
              </Table.td>
              <Table.td>
                <CopyHelper toCopy={shortenAddress(_token.wrapped.address)}>
                  <Typography weight={500} variant="sm" className="text-slate-100">
                    {shortenAddress(_token.wrapped.address)}
                  </Typography>
                </CopyHelper>
              </Table.td>
              <Table.td>
                <Link.External
                  href={chain.getTokenUrl(_token.wrapped.address)}
                  className="flex items-center gap-1 !no-underline"
                >
                  <Typography weight={500} variant="sm" className="text-slate-100">
                    View
                  </Typography>
                  <ExternalLinkIcon width={18} height={18} />
                </Link.External>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
