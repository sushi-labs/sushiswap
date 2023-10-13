import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addTransaction, editTransactionStatus, getTransactions, Transaction,} from "@sushiswap/dexie";
import {waitForTransaction} from "@wagmi/core";

const useTransactions = ({
	account,
}: { account: `0x${string}` | undefined }) => {
	return useQuery({
		queryKey: ["transactions", { account }],
		queryFn: async () => {
			return await getTransactions(account);
		},
	});
};

const usePendingTransactions = ({
	account,
}: { account: `0x${string}` | undefined }) => {
	return useQuery({
		queryKey: ["transactions", { account }],
		queryFn: async () => {
			const transactions = await getTransactions(account);
			return transactions.filter((el) => el.status === "pending");
		},
	});
};

const useTransactionStatusUpdater = ({
	account,
}: { account: `0x${string}` | undefined }) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: editTransactionStatus,
		onSuccess: (data) => {
			queryClient.setQueryData<Transaction[]>(
				["transactions", { account }],
				(prev) => {
					if (!prev) return [];
					return [
						...prev.map((el) =>
							el.hash === data.id ? { ...el, status: data.status } : { ...el },
						),
					];
				},
			);

			queryClient.refetchQueries(["transactions", { account }])
		},
	});
};

const useTransactionAdder = ({
	account,
}: { account: `0x${string}` | undefined }) => {
	const queryClient = useQueryClient();
	const { mutate } = useTransactionStatusUpdater({ account });

	return useMutation({
		mutationFn: addTransaction,
		onSuccess: (data) => {

			// Update cache to trigger the useQuery hooks
			queryClient.setQueryData<Transaction[]>(
				["transactions", { account }],
				(prev) => {
					if (prev) return [...prev, { ...data, status: "pending" }];
					return [{ ...data, status: "pending" }];
				},
			);

			// Listen to transaction changes and update status once resolved
			waitForTransaction({
				chainId: data.chainId,
				hash: data.hash,
				onReplaced: (resp) => {
					mutate({
						id: data.hash,
						status: "replaced",
					});
				},
			}).then((receipt) => {
				mutate({
					id: data.hash,
					status: receipt.status,
				});
			});
		},
	});
};

export {
	useTransactions,
	usePendingTransactions,
	useTransactionAdder,
	useTransactionStatusUpdater,
};
