import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
import { Chain } from '@sushiswap/chain'
import { shortenAddress } from '@sushiswap/format'
import { Token as GraphToken } from '@sushiswap/graph-client'
import { ClipboardController, LinkExternal } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui/components/currency'
import { Table } from '@sushiswap/ui/components/table'
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
      <p className="font-semibold  text-slate-50">Token Information</p>
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
                <p className="font-semibold text-sm text-slate-100">{_token.symbol}</p>
              </Table.td>
              <Table.td>
                <div className="flex items-center gap-2">
                  <Currency.Icon currency={_token} width={24} height={24} />
                  <p className="font-medium text-sm text-slate-100">{_token.name}</p>
                </div>
              </Table.td>
              <Table.td>
                <ClipboardController>
                  {({ setCopied }) => (
                    <span onClick={() => setCopied(_token.wrapped.address)} className="text-sm font-medium">
                      {shortenAddress(_token.wrapped.address)}
                    </span>
                  )}
                </ClipboardController>
              </Table.td>
              <Table.td>
                <LinkExternal
                  href={chain.getTokenUrl(_token.wrapped.address)}
                  className="flex items-center gap-1 !no-underline"
                >
                  <p className="font-medium text-sm text-slate-100">View</p>
                  <ExternalLinkIcon width={18} height={18} />
                </LinkExternal>
              </Table.td>
            </Table.tr>
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
