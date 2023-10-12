"use client";

import React, {FC, ReactNode} from "react";
import {
	ToastClose,
	ToastDescription,
	Toastnew,
	ToastProps,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "./toastnew";
import {useToast} from "./use-toast";
import {classNames, LinkExternal} from "..";
import {Chain, ChainId} from "sushi/chain";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(function ({ id, content, ...props }) {
				return <div key={id}>{content}</div>;
			})}
			<ToastViewport />
		</ToastProvider>
	);
}

interface ToastDefault extends Omit<ToastProps, "title"> {
	title?: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
}

export const ToastDefault: FC<ToastDefault> = ({
	title,
	description,
	action,
	...props
}) => {
	return (
		<Toastnew {...props}>
			<div className="grid gap-1">
				{title && <ToastTitle>{title}</ToastTitle>}
				{description && <ToastDescription>{description}</ToastDescription>}
			</div>
			{action}
			<ToastClose />
		</Toastnew>
	);
};

interface ToastTransaction extends Omit<ToastProps, "title"> {
	title?: ReactNode;
	description?: ReactNode;
	action?: ReactNode;
	chainId: ChainId;
	hash: string;
	status: "pending" | "failed" | "success";
}

export const ToastTransaction: FC<ToastTransaction> = ({
	title,
	description,
	chainId,
	hash,
	status,
	action,
	...props
}) => {
	return (
		<Toastnew
			variant={
				status === "success"
					? "success"
					: status === "failed"
					? "destructive"
					: "default"
			}
			{...props}
		>
			<div className="grid gap-1">
				{title && <ToastTitle>{title}</ToastTitle>}
				{description ? (
					<ToastDescription>{description}</ToastDescription>
				) : null}
				<ToastDescription>
					<LinkExternal
						href={Chain.from(chainId)?.getTxUrl(hash)}
						className={classNames(
							["success", "failed"].includes(status) ? "text-white" : "",
							"underline",
						)}
					>
						View on explorer
					</LinkExternal>
					.{" "}
				</ToastDescription>
			</div>
			<ToastClose />
		</Toastnew>
	);
};
