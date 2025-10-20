import type {
  PortfolioV2PositionPoolType,
  PortfolioV2PositionV3PoolType,
} from '@sushiswap/graph-client/data-api-portfolio'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import type { SushiSwapProtocol } from 'sushi/evm'
import { ManageDialogHeader } from './manage-dialog-header'
import { V2Content } from './v2-content/v2-content'
import { V3Content } from './v3-content/v3-content'

export type LPTabValueType = 'detail' | 'manage' | 'migrate'

const LPTabValuesV2: LPTabValueType[] = ['detail', 'manage', 'migrate']
const LPTabValuesV3: LPTabValueType[] = ['detail', 'manage']

const TABS: Record<
  // @TODO - switch to SushiSwapProtocol once BLADE is supported
  Exclude<SushiSwapProtocol, 'BLADE'>,
  { label: string; value: LPTabValueType }[]
> = {
  SUSHISWAP_V2: [
    { label: 'Position Detail', value: 'detail' },
    { label: 'Manage Position', value: 'manage' },
    { label: 'Migrate Position', value: 'migrate' },
  ],
  SUSHISWAP_V3: [
    { label: 'Position Detail', value: 'detail' },
    { label: 'Manage Position', value: 'manage' },
  ],
}

export const ManageDialog = ({
  data,
  isOpen,
  setIsOpen,
  triggerChildren,
}: {
  data: PortfolioV2PositionPoolType
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  triggerChildren?: React.ReactNode
}) => {
  const { createQuery } = useCreateQuery()
  const [currentTab, setCurrentTab] = useState<LPTabValueType>('detail')
  const searchParams = useSearchParams()
  const headTabParam = searchParams.get('lpPosTab') as
    | LPTabValueType
    | undefined

  useEffect(() => {
    if (
      headTabParam &&
      data?.pool?.protocol === 'SUSHISWAP_V2' &&
      LPTabValuesV2.includes(headTabParam)
    ) {
      setCurrentTab(headTabParam)
    }
    if (
      headTabParam &&
      data?.pool?.protocol === 'SUSHISWAP_V3' &&
      LPTabValuesV3.includes(headTabParam)
    ) {
      setCurrentTab(headTabParam)
    }
  }, [headTabParam, data])

  const tabs = useMemo(() => {
    switch (data?.pool?.protocol) {
      case 'SUSHISWAP_V2':
        return TABS.SUSHISWAP_V2
      case 'SUSHISWAP_V3':
        return TABS.SUSHISWAP_V3

      default:
        return TABS.SUSHISWAP_V3
    }
  }, [data?.pool?.protocol])

  const content = useMemo(() => {
    switch (data?.pool?.protocol) {
      case 'SUSHISWAP_V2':
        return <V2Content currentTab={currentTab} position={data} />
      case 'SUSHISWAP_V3':
        return (
          <V3Content
            currentTab={currentTab}
            position={data as PortfolioV2PositionV3PoolType}
          />
        )

      default:
        return <div>{data?.pool?.protocol} unsupported.</div>
    }
  }, [data, currentTab])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="!px-1 border !flex flex-col !max-w-full md:!max-w-[520px] border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full max-h-[100dvh] overflow-y-auto hide-scrollbar"
      >
        <DialogTitle className="!font-medium px-3">
          <ManageDialogHeader data={data} />
        </DialogTitle>

        <div className="px-3 w-full">
          <Tabs
            defaultValue={'detail'}
            value={currentTab}
            onValueChange={(value) => {
              setCurrentTab(value as LPTabValueType)
              createQuery([
                {
                  name: 'lpPosTab',
                  value: value,
                },
              ])
            }}
          >
            <TabsList className="!bg-transparent !rounded-[14px] shadow-sm !px-[1px] gap-1 w-full">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="!bg-transparent !border-none w-full  !shadow-none !px-0  focus-visible:!ring-0 focus-visible:!ring-offset-0 !ring-transparent"
                >
                  <Button
                    key={tab.value}
                    asChild
                    size="sm"
                    variant={currentTab === tab.value ? 'tertiary' : 'ghost'}
                    className={'select-none !gap-1 w-full'}
                  >
                    {tab.label}
                  </Button>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={currentTab}>{content}</TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
