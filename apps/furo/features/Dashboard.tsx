import { CheckIcon, XIcon } from '@heroicons/react/outline'
import { ExternalLinkIcon } from '@heroicons/react/solid'
import { Token } from '@sushiswap/currency'
import { shortenAddress } from '@sushiswap/format'
import { Switch, Typography } from '@sushiswap/ui'
import { getExplorerLink } from 'functions'
import { useChain, useStreamBalances } from 'hooks'
import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import useSWR from 'swr'

import { Streams } from '../pages/api/streams/[chainId]/[address]'
import { Vestings } from '../pages/api/vestings/[chainId]/[address]'
import { toToken } from './context/mapper'
import { FuroTable, FuroTableType } from './FuroTable'
import { Rebase } from '.graphclient'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

export const Dashboard: FC<{ chainId: number; address: string }> = ({ chainId, address }) => {
  const chain = useChain(chainId)
  const [showActiveIncoming, setShowActiveIncoming] = useState(false)
  const [showActiveOutgoing, setShowActiveOutgoing] = useState(false)
  const { data: streams, isValidating: isValidatingStreams } = useSWR<Streams>(
    `/furo/api/streams/${chainId}/${address}`,
    fetcher
  )
  const { data: vestings, isValidating: isValidatingVestings } = useSWR<Vestings>(
    `/furo/api/vestings/${chainId}/${address}`,
    fetcher
  )
  const [ids, tokens] = useMemo(() => {
    const ids: [string][] = []
    const tokens: Token[] = []

    streams?.incomingStreams?.forEach((stream) => {
      ids.push([stream.id])
      tokens.push(toToken(stream.token, chainId))
    })

    streams?.outgoingStreams?.forEach((stream) => {
      ids.push([stream.id])
      tokens.push(toToken(stream.token, chainId))
    })

    return [ids, tokens]
  }, [chainId, streams?.incomingStreams, streams?.outgoingStreams])

  const { data: rebases, isValidating: isValidatingRebases } = useSWR<Rebase[]>(
    () =>
      streams
        ? [
            `/furo/api/rebases/${chainId}/${tokens.map((token) => token.address).join('/')}`,
            tokens.map((token) => token.address),
          ]
        : null,
    fetcher
  )

  const { isLoading: balancesLoading, data: balancesData } = useStreamBalances(chainId, ids, tokens, {
    blocksPerFetch: 3,
  })

  console.log('REBASES', rebases)

  return (
    <div className="flex flex-col h-full gap-12 pt-10">
      <div className="flex flex-col justify-center gap-1 pb-4">
        <Typography variant="h3" weight={700} className="text-slate-200">
          Dashboard
        </Typography>
        {address && (
          <div className="flex">
            <Link passHref={true} href={getExplorerLink(chainId, address, 'address')}>
              <Typography
                variant="sm"
                weight={700}
                className="flex gap-1 cursor-pointer text-slate-500 hover:text-blue"
                as="a"
                target="_blank"
              >
                {shortenAddress(address)}
                <ExternalLinkIcon width={16} />
              </Typography>
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-slate-200">
              Incoming
            </Typography>
            <div className="flex items-center gap-3">
              <Typography variant="sm" className="text-slate-400">
                Show active
              </Typography>
              <Switch
                checked={showActiveIncoming}
                onChange={() => setShowActiveIncoming((prevState) => !prevState)}
                size="sm"
                color="gradient"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
          </div>
          <FuroTable
            balances={balancesData}
            globalFilter={showActiveIncoming}
            setGlobalFilter={setShowActiveIncoming}
            loading={isValidatingStreams || isValidatingRebases || balancesLoading}
            streams={streams?.incomingStreams ?? []}
            vestings={vestings?.incomingVestings ?? []}
            rebases={rebases}
            type={FuroTableType.INCOMING}
            placeholder="No incoming streams found"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <Typography variant="lg" weight={700} className="text-slate-200">
              Outgoing
            </Typography>
            <div className="flex items-center gap-3">
              <Typography variant="sm" className="text-slate-400">
                Show active
              </Typography>
              <Switch
                checked={showActiveOutgoing}
                onChange={() => setShowActiveOutgoing((prevState) => !prevState)}
                size="sm"
                color="gradient"
                uncheckedIcon={<XIcon />}
                checkedIcon={<CheckIcon />}
              />
            </div>
          </div>
          <FuroTable
            balances={balancesData}
            globalFilter={showActiveOutgoing}
            setGlobalFilter={setShowActiveOutgoing}
            loading={isValidatingVestings || isValidatingRebases || balancesLoading}
            streams={streams?.outgoingStreams ?? []}
            vestings={vestings?.outgoingVestings ?? []}
            rebases={rebases}
            type={FuroTableType.OUTGOING}
            placeholder="No outgoing streams found"
          />
        </div>
      </div>
    </div>
  )
}
