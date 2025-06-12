import { DeleteAccountCard } from './_common/ui/delete-account/delete-account-card'
import { IdentityProvidersCard } from './_common/ui/identity-providers/identity-providers-card'
import { PasswordCard } from './_common/ui/password/password-card'
import { UserDetailsCard } from './_common/ui/user-details/user-details-card'

export default async function Page({
  params,
}: { params: Promise<{ teamId: string }> }) {
  const teamId = (await params).teamId

  return (
    <div className="flex flex-row space-x-8">
      <div className="flex flex-col space-y-8">
        <UserDetailsCard />
        <IdentityProvidersCard teamId={teamId} />
      </div>
      <div className="flex flex-col space-y-8">
        <PasswordCard />
        <DeleteAccountCard />
      </div>
    </div>
  )
}
