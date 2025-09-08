import { DeleteAccountCard } from './_common/ui/delete-account/delete-account-card'
import { IdentityProvidersCard } from './_common/ui/identity-providers/identity-providers-card'
import { PasswordCard } from './_common/ui/password/password-card'
import { UserDetailsCard } from './_common/ui/user-details/user-details-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col gap-8">
        <UserDetailsCard />
        <IdentityProvidersCard teamId={teamId} />
      </div>
      <div className="flex flex-col gap-8">
        <PasswordCard />
        <DeleteAccountCard />
      </div>
    </div>
  )
}
