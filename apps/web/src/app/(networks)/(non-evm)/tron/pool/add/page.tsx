import { DepositForm } from '~tron/_common/ui/Pools/Add/deposit-form'
import { SelectTokensForm } from '~tron/_common/ui/Pools/Add/select-tokens-form'

export default function AddPage() {
  return (
    <>
      <SelectTokensForm />
      <DepositForm />
    </>
  )
}
