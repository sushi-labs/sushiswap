import { isEvmChainId } from 'sushi/evm'
import type { TokenSelectorChainId } from '../../config'
import type { TokenApprovalStatus } from '../../hooks/token-list-token'

interface ShouldBypassTokenSecurityCheck {
  chainId: TokenSelectorChainId
  approvalStatus: TokenApprovalStatus | undefined
}

export function shouldBypassTokenSecurityCheck({
  chainId,
  approvalStatus,
}: ShouldBypassTokenSecurityCheck): boolean {
  return (
    isEvmChainId(chainId) &&
    (approvalStatus === 'APPROVED' || approvalStatus === 'PERMISSIONLESS')
  )
}
