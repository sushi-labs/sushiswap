import { DepositForm } from "src/components/Pools/Add/DepositForm";
import { SelectTokensForm } from "src/components/Pools/Add/SelectTokensForm";

export default function AddPage() {
	return (
		<>
			<SelectTokensForm />
			<DepositForm />
		</>
	);
}
