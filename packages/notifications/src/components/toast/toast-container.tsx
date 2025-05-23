"use client";
//TODO: remove old version of react-toastify
import "react-toastify-v2/dist/ReactToastify.css";

import { type FC } from "react";
import { Slide, toast, ToastContainer as ToastifyContainer, useToastContainer } from "react-toastify-v2";
import { Button, classNames, useBreakpoint } from "@sushiswap/ui";

interface ToastContainer {
	className?: string;
}

export const ToastContainer: FC<ToastContainer> = ({ className }) => {
	const breakpoint = useBreakpoint("sm");

	const { count } = useToastContainer({
		stacked: true,
	});

	const goToInbox = () => {
		toast.dismiss();
		const url = new URL(window.location.href);
		url.searchParams.set("accountDrawer", "true");
		window.history.pushState({}, "", url);
	};

	return (
		<ToastifyContainer
			toastClassName={() =>
				"bg-[#FFFFFF24] dark:bg-[#00000024] border dark:border-[#FFFFFF14] border-[#00000014] mx-2 flex flex-col backdrop-blur-md rounded-xl overflow-hidden text-[color:var(--color)] pointer-events-auto"
			}
			className={className}
			position={!breakpoint.isSm ? "bottom-center" : "top-right"}
			stacked={true}
			transition={Slide}
			underToastChildren={
				<div className="flex flex-col gap-2">
					<Button
						size="sm"
						className={classNames("w-full")}
						onClick={() => {
							toast.dismiss();
						}}>
						Dismiss All ({count})
					</Button>
					<Button
						size="sm"
						onClick={() => {
							goToInbox();
						}}
						className={classNames(
							"w-full dark:text-slate-50 backdrop-blur-md border border-accent text-slate-900 bg-[#FFFFFF24] dark:bg-[#00000024]"
						)}
						variant="secondary">
						Go To Inbox
					</Button>
				</div>
			}
		/>
	);
};
