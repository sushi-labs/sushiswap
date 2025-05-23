import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const useAccountDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const searchParams = useSearchParams();
	const isAccountDrawerOpen = searchParams.get("accountDrawer") === "true";
	const accountTab = searchParams.get("accountTab");
	const subAccountTab = searchParams.get("subAccountTab");
	const router = useRouter();
	const pathname = usePathname();

	const createQueryString = useCallback(
		(pairs: { name: string; value: string }[]) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const { name, value } of pairs) {
				params.set(name, value);
			}
			return params.toString();
		},
		[searchParams]
	);

	useEffect(() => {
		if (isAccountDrawerOpen) {
			setIsOpen(true);
		}
	}, [isAccountDrawerOpen]);

	const handleAccountDrawer = ({
		state,
		params,
	}: {
		state: boolean;
		params?: { name: string; value: string } | { name: string; value: string }[];
	}) => {
		const queryArray = [];
		if (params) {
			Array.isArray(params) ? queryArray.push(...params) : queryArray.push(params);
		}
		queryArray.push({ name: "accountDrawer", value: state ? "true" : "false" });

		router.replace(`${pathname}?${createQueryString(queryArray)}`);

		setIsOpen(state);
	};

	return {
		isOpen,
		handleAccountDrawer,
		accountTab,
		subAccountTab,
	};
};
