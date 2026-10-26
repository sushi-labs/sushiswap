import { Container } from '@sushiswap/ui'
import { GeoBlockedMessage } from '../_ui/_common'
import { CreateSubAccountDialog } from './_ui/create-sub-account-dialog'
import { SubAccountsTable } from './_ui/sub-accounts-table'

export default function SubAccountsPage() {
  return (
    <div className="overflow-x-hidden min-h-[calc(100vh-56px)] bg-perps-background">
      <GeoBlockedMessage />
      <Container maxWidth="7xl" className="px-2 pb-4 pt-6 md:px-4 md:pt-12">
        <div className="flex flex-col gap-2 mb-7">
          <div className="flex items-center gap-2 justify-between flex-wrap">
            <h1 className="text-4xl font-medium">Sub-Accounts</h1>
            <CreateSubAccountDialog />
          </div>
        </div>
        <SubAccountsTable />
      </Container>
    </div>
  )
}
