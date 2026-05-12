import {
  ClipboardCheckIcon,
  ClipboardCopyIcon,
} from '@heroicons/react-v1/solid'
import { useCopyClipboard } from '@sushiswap/hooks'
import { Button, IconButton, SkeletonBox } from '@sushiswap/ui'
import { useVaultDetails } from 'src/lib/perps/info/use-vault-details'
import { truncateString } from 'sushi'
import type { EvmAddress } from 'sushi/evm'

export const VaultHeader = ({ vaultAddress }: { vaultAddress: EvmAddress }) => {
  const [isCopied, staticCopy] = useCopyClipboard()
  const { data, isLoading } = useVaultDetails({ vaultAddress })
  return (
    <div className="flex flex-wrap items-start gap-2 justify-between">
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <SkeletonBox className="h-10 w-[350px]" />
        ) : (
          <h1 className="text-4xl font-medium">{data?.name}</h1>
        )}
        <div className="!text-perps-muted-50 flex items-center gap-1 text-xs">
          <div>{truncateString(vaultAddress, 10, 'middle')}</div>

          <IconButton
            name="share"
            size="xs"
            icon={isCopied ? ClipboardCheckIcon : ClipboardCopyIcon}
            onClick={() => staticCopy(vaultAddress)}
            variant="ghost"
            className="!text-perps-muted-50"
          />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="perps-secondary">Withdraw</Button>
        <Button variant="perps-secondary">Deposit</Button>
      </div>
    </div>
  )
}
