import { IdentityProvidersCard } from './_common/ui/identity-providers/identity-providers-card'
import { PasswordCard } from './_common/ui/password/password-card'
import { UserCard } from './_common/ui/user/user-card'

export default function Page() {
  return (
    <div className="flex flex-row space-x-8">
      <div className="flex flex-col space-y-8">
        <UserCard />
        <IdentityProvidersCard />
      </div>
      <div className="flex flex-col space-y-8">
        <PasswordCard />
      </div>
    </div>
  )
}
