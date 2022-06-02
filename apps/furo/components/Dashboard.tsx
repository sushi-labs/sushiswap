import { Tab } from '@headlessui/react'
import { CheckIcon, PaperAirplaneIcon, XIcon } from '@heroicons/react/outline'
import { Token } from '@sushiswap/currency'
import { Rebase } from '@sushiswap/graph-client'
import { useIsMounted } from '@sushiswap/hooks'
import { Chip, classNames, Menu, Switch, Typography } from '@sushiswap/ui'
import { toToken } from 'lib'
import { useStreamBalances } from 'lib/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Streams, Vestings } from 'types'
import { useAccount, useConnect } from 'wagmi'

import { FuroTable, FuroTableType } from './FuroTable'

const fetcher = (params: any) =>
  fetch(params)
    .then((res) => res.json())
    .catch((e) => console.log(JSON.stringify(e)))

export const Dashboard: FC<{ chainId: number; address: string }> = ({ chainId, address }) => {
  const isMounted = useIsMounted()
  const router = useRouter()
  const { data: account } = useAccount()
  const { isConnected } = useConnect()

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
          <Typography variant="h2" weight={700} className="text-slate-200">
            <span className="text-blue">Furo</span> Streaming
          </Typography>
          <Typography className="text-slate-400">
            Earn, stream and automate your DAO salaries <br /> and token vesting with Furo.
          </Typography>
          <div className="flex mt-4 h-9">
            {account?.address && isMounted && isConnected && (
              <Menu
                button={
                  <Menu.Button
                    color="blue"
                    fullWidth
                    startIcon={<PaperAirplaneIcon width={18} className="transform rotate-45 -mt-0.5" />}
                    className="!h-[36px] px-6"
                    as="div"
                  >
                    Pay Someone
                  </Menu.Button>
                }
              >
                <Menu.Items unmount={false} className="!min-w-0">
                  <Link passHref={true} href="/stream/create">
                    <Menu.Item as="a">Stream</Menu.Item>
                  </Link>
                  <Link passHref={true} href="/vesting/create">
                    <Menu.Item as="a">Vesting</Menu.Item>
                  </Link>
                </Menu.Items>
              </Menu>
            )}
          </div>
        </div>
      </div>
      <Tab.Group as="div" className="space-y-6">
        <div className="flex justify-between px-2">
          <Tab.List className="flex gap-10">
            <Tab
              as={Typography}
              weight={700}
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200 ' : 'text-slate-500',
                  'outline-none ring-0 flex items-center gap-3'
                )
              }
            >
              Earning{' '}
              <Chip
                color="blue"
                label={((streams?.incomingStreams?.length || 0) + (vestings?.incomingVestings?.length || 0)).toString()}
              />
            </Tab>
            <Tab
              as={Typography}
              weight={700}
              className={({ selected }) =>
                classNames(
                  selected ? 'text-slate-200 ' : 'text-slate-500',
                  'outline-none ring-0 flex items-center gap-3'
                )
              }
            >
              Payment{' '}
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
              color="gradient"
              uncheckedIcon={<XIcon />}
              checkedIcon={<CheckIcon />}
            />
          </div>
        </div>
        <Tab.Panels>
          <Tab.Panel>
            <FuroTable
              chainId={chainId}
              balances={balancesData}
              globalFilter={showActiveIncoming}
              setGlobalFilter={setShowActiveIncoming}
              loading={isValidatingVestings || isValidatingStreams || isValidatingRebases || balancesLoading}
              streams={streams?.incomingStreams ?? []}
              vestings={vestings?.incomingVestings ?? []}
              rebases={rebases}
              type={FuroTableType.INCOMING}
              placeholder="No incoming streams found"
            />
          </Tab.Panel>
          <Tab.Panel>
            <FuroTable
              chainId={chainId}
              balances={balancesData}
              globalFilter={showActiveOutgoing}
              setGlobalFilter={setShowActiveOutgoing}
              loading={isValidatingVestings || isValidatingStreams || isValidatingRebases || balancesLoading}
              streams={streams?.outgoingStreams ?? []}
              vestings={vestings?.outgoingVestings ?? []}
              rebases={rebases}
              type={FuroTableType.OUTGOING}
              placeholder="No outgoing streams found"
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
