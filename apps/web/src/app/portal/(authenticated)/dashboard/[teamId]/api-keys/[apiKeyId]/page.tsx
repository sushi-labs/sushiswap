import { ApiKeyBasicSettingsCard } from './_common/ui/api-key-basic-settings/api-key-basic-settings-card'
import { ApiKeyDeleteCard } from './_common/ui/api-key-delete/api-key-delete-card'
import { ApiKeyKeyCard } from './_common/ui/api-key-key/api-key-key-card'
import { ApiKeyKeyForm } from './_common/ui/api-key-key/api-key-key-form'
import { ApiKeyRateLimitCard } from './_common/ui/api-key-rate-limit/api-key-rate-limit-card'
import { ApiKeyRestrictionsCard } from './_common/ui/api-key-restrictions/api-key-restrictions-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string; apiKeyId: string }> }) {
  const { teamId, apiKeyId } = await params

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col gap-8">
          <ApiKeyBasicSettingsCard teamId={teamId} apiKeyId={apiKeyId} />
          <ApiKeyDeleteCard teamId={teamId} apiKeyId={apiKeyId} />
        </div>
        <div className="flex flex-col gap-8">
          <ApiKeyRateLimitCard teamId={teamId} apiKeyId={apiKeyId} />
          <ApiKeyKeyCard teamId={teamId} apiKeyId={apiKeyId} />
        </div>
      </div>
      <ApiKeyRestrictionsCard teamId={teamId} apiKeyId={apiKeyId} />
    </div>
  )
}
