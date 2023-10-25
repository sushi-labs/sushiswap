import { Tab } from '@headlessui/react'
import { CheckIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/outline'
import { Token } from '@sushiswap/currency'
import { FuroStreamChainId } from '@sushiswap/furo'
import { useIsMounted } from '@sushiswap/hooks'
import { Chip, classNames, Menu, Switch, Typography } from '@sushiswap/ui'
import stringify from 'fast-json-stable-stringify'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccount } from '@sushiswap/wagmi'

import { Rebase } from '../.graphclient'
import { toToken, useStreamBalances } from '../lib'
import { Streams, Vestings } from '../types'
import { FuroTableType, StreamTable } from './Table'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .catch((e) => console.log(stringify(e)))

export const Dashboard: FC<{
  chainId: FuroStreamChainId
  address: string
  showOutgoing: boolean
}> = ({ chainId, address, showOutgoing }) => {
  const isMounted = useIsMounted()
  const router = useRouter()
  const { address: account, isConnected } = useAccount()

  const [showActiveIncoming, setShowActiveIncoming] = useState(false)

  const { data: streams, isValidating: isValidatingStreams } = useSWR<Streams>(
    `/furo/api/user/${chainId}/${address}/streams`,
    fetcher
  )
  const { data: vestings, isValidating: isValidatingVestings } = useSWR<Vestings>(
    `/furo/api/user/${chainId}/${address}/vestings`,
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

    vestings?.incomingVestings?.forEach((vesting) => {
      tokens.push(toToken(vesting.token, chainId))
    })

    vestings?.outgoingVestings?.forEach((vesting) => {
      tokens.push(toToken(vesting.token, chainId))
    })

    return [ids, tokens]
  }, [
    chainId,
    streams?.incomingStreams,
    streams?.outgoingStreams,
    vestings?.incomingVestings,
    vestings?.outgoingVestings,
  ])

  const { data: rebases, isValidating: isValidatingRebases } = useSWR<Rebase[]>(
    () =>
      streams
        ? [
            `/furo/api/rebases/${chainId}/${tokens.map((token) => token.address).join('/')}`,
            tokens.map((token) => token.address),
          ]
        : null,
    ([url]: [string]) => fetcher(url)
  )

  const { isLoading: balancesLoading, data: balancesData } = useStreamBalances(chainId, ids, tokens, {
    blocksPerFetch: 3,
  })

  // Prefetch stream/vesting pages
  useEffect(() => {
    void router.prefetch('/stream/[id]')
    void router.prefetch('/vesting/[id]')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-full gap-[80px] pt-20">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Typography variant="h2" weight={500} className="text-slate-200">
            <span className="text-blue">Furo</span> Streaming
          </Typography>
          <Typography className="text-slate-400">
            Earn, stream and automate your DAO salaries <br /> and token vesting with Furo.
          </Typography>
          <div className="flex mt-4 h-9">
            {account && isMounted && isConnected && (
              <Menu
                button={
                  <Menu.Button
                    color="blue"
                    fullWidth
                    startIcon={<PaperAirplaneIcon width={18} className="transform rotate-45 -mt-0.5" />}
                    className="px-6"
                    as="div"
                  >
                    Pay Someone
                  </Menu.Button>
                }
              >
                <Menu.Items unmount={false} className="!min-w-0">
                  <Link passHref={true} href="/stream/create" legacyBehavior>
                    <Menu.Item as="a">Stream</Menu.Item>
                  </Link>
                  <Link passHref={true} href="/vesting/create" legacyBehavior>
                    <Menu.Item as="a">Vesting</Menu.Item>
                  </Link>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </div>
      </div>
      <Tab.Group as="div" className="space-y-6" defaultIndex={showOutgoing ? 1 : 0}>
        <div className="flex flex-wrap justify-between px-2 gap-y-4">
          <Tab.List className="flex gap-10">
            <Tab
              as={Typography}
              weight={500}
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200 ' : 'text-slate-500',
                  'outline-none ring-0 flex items-center gap-3'
                )
              }
            >
              Incoming{' '}
              <Chip
                color="blue"
                label={((streams?.incomingStreams?.length || 0) + (vestings?.incomingVestings?.length || 0)).toString()}
              />
            </Tab>
            <Tab
              as={Typography}
              weight={500}
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200 ' : 'text-slate-500',
                  'outline-none ring-0 flex items-center gap-3'
                )
              }
            >
              Outgoing{' '}
              <Chip
                color="pink"
                label={((streams?.outgoingStreams?.length || 0) + (vestings?.outgoingVestings?.length || 0)).toString()}
              />
            </Tab>
          </Tab.List>
          <div className="flex items-center gap-3">
            <Typography variant="sm" className="text-slate-400">
              Active Streams Only
            </Typography>
            <Switch
              checked={showActiveIncoming}
              onChange={() => setShowActiveIncoming((prevState) => !prevState)}
              size="sm"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          </div>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <StreamTable
              chainId={chainId}
              balances={balancesData}
              globalFilter={showActiveIncoming}
              setGlobalFilter={setShowActiveIncoming}
              loading={isValidatingVestings || isValidatingStreams || isValidatingRebases || balancesLoading}
              streams={streams?.incomingStreams ?? []}
              vestings={vestings?.incomingVestings ?? []}
              rebases={rebases}
              type={FuroTableType.INCOMING}
              placeholder={
                <>
                  No <b>incoming</b> streams found
                </>
              }
            />
          </Tab.Panel>
          <Tab.Panel>
            <StreamTable
              chainId={chainId}
              balances={balancesData}
              globalFilter={showActiveIncoming}
              setGlobalFilter={setShowActiveIncoming}
              loading={isValidatingVestings || isValidatingStreams || isValidatingRebases || balancesLoading}
              streams={streams?.outgoingStreams ?? []}
              vestings={vestings?.outgoingVestings ?? []}
              rebases={rebases}
              type={FuroTableType.OUTGOING}
              placeholder={
                <>
                  No <b>outgoing</b> streams found
                </>
              }
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
