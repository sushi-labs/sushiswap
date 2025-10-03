import { DepositForm } from '~kadena/_common/ui/Pools/Add/DepositForm'
import { SelectTokensForm } from '~kadena/_common/ui/Pools/Add/SelectTokensForm'

export default function AddPage() {
  return (
    <>
      <SelectTokensForm />
      <DepositForm />
    </>
  )
}
