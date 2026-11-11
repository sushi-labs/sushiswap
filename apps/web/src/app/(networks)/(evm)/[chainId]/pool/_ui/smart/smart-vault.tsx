import { PlusIcon } from '@heroicons/react/24/solid'
import type {
  SmartPoolChainId,
  VaultV1,
} from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Separator,
  SkeletonBox,
  SkeletonText,
  Stat,
  StatLabel,
  StatValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import { notFound } from 'next/navigation'
import { type ReactNode, Suspense } from 'react'
import {
  SteerBaseStrategy,
  type SteerVaultPool,
} from 'src/lib/steer/components/steer-strategies'
import {
  getAdjustment,
  getVaultGenerics,
} from 'src/lib/steer/fetchers/get-vault-generics'
import { CurrencyInputSkeleton } from 'src/lib/wagmi/components/web3-input/currency/currency-input-skeleton'
import type { Address, Hex } from 'viem'
import { getCachedVault } from './get-cached-vaults'

interface SmartVaultParams {
  chainId: SmartPoolChainId
  vaultAddress: Address
}

export async function SmartVaultLayout({
  chainId,
  vaultAddress,
  children,
}: SmartVaultParams & { children: ReactNode }) {
  const vault = await getCachedVault({ chainId, vaultAddress })

  if (!vault) {
    return notFound()
  }

  return (
    <Container maxWidth="5xl" className="px-4">
      {vault.isDeprecated && (
        <div className="text-center text-red dark:text-red-600 w-full pb-8">
          <div className=" font-medium">This vault is deprecated.</div>
          <div className="text-sm">
            {"It will not accrue any fees and won't be readjusted."}
          </div>
        </div>
      )}
      <Suspense fallback={<SmartVaultLoading vault={vault} />}>
        {children}
      </Suspense>
    </Container>
  )
}

export async function SmartVault({
  chainId,
  vaultAddress,
  poolAddress,
  pool,
}: SmartVaultParams & { poolAddress: Hex; pool: SteerVaultPool }) {
  const vault = await getCachedVault({ chainId, vaultAddress })

  if (!vault || vault.poolAddress.toLowerCase() !== poolAddress.toLowerCase()) {
    return notFound()
  }

  const generics = await getVaultGenerics(vault)

  return <SteerBaseStrategy pool={pool} vault={vault} generic={generics} />
}

export function SmartVaultLoading({ vault }: { vault: VaultV1 }) {
  const adjustment = getAdjustment(vault)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Liquidity</CardTitle>
          <CardDescription>
            Depending on your range, the supplied tokens for this position will
            not always be a 50:50 ratio.
          </CardDescription>
        </CardHeader>
        <Tabs className="w-full" defaultValue="add">
          <CardContent>
            <TabsList className="!flex">
              {['Add', 'Remove', 'Position'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="flex-1 disabled:opacity-100"
                  disabled
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </CardContent>
          <div className="px-6">
            <Separator />
          </div>
          <TabsContent value="add">
            <CardHeader className="relative">
              <CardTitle>Add liquidity</CardTitle>
              <CardDescription>
                Provide liquidity to earn fees & rewards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <CurrencyInputSkeleton className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent" />
                <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
                  <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
                    <PlusIcon
                      width={16}
                      height={16}
                      className="text-muted-foreground"
                    />
                  </div>
                </div>
                <CurrencyInputSkeleton className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent" />
                <SkeletonBox className="w-full h-[52px] rounded-xl" />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{vault.strategy}</CardTitle>
          <CardDescription>{vault.description}</CardDescription>
        </CardHeader>
        <Separator />
        <div className="grid grid-cols-2">
          {[
            'Total APR (24h)',
            'TVL',
            `${vault.token0.symbol}:${vault.token1.symbol} Ratio (%)`,
            'Adjustment frequency',
            `${adjustment.next.includes('ago') ? 'Last' : 'Next'} Adjustment`,
            'Liquidity pool fee',
          ].map((label) => (
            <Stat key={label} className="px-6 py-3">
              <StatLabel size="sm">{label}</StatLabel>
              <StatValue size="sm">
                {label === 'Adjustment frequency' ? (
                  <>At most every {adjustment.frequency}</>
                ) : (
                  <SkeletonText fontSize="sm" className="max-w-24" />
                )}
              </StatValue>
            </Stat>
          ))}
        </div>
        <Separator />
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Liquidity Distribution</CardTitle>
            <SkeletonBox className="w-[107px] h-5 shrink-0" />
          </div>
        </CardHeader>
        <div className="px-6 h-[200px] w-full">
          <SkeletonBox className="w-full h-full" />
        </div>
        <div className="flex flex-wrap gap-2 justify-between p-6">
          {['Minimum price', 'Maximum price'].map((label) => (
            <Stat key={label}>
              <StatLabel size="sm">{label}</StatLabel>
              <StatValue size="sm">
                <SkeletonText fontSize="sm" className="w-32" />
              </StatValue>
            </Stat>
          ))}
        </div>
      </Card>
    </div>
  )
}
