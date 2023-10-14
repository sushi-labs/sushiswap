"use client";

import {useToast} from "./use-toast";
import {ToastClose, ToastDescription, Toastnew, ToastProvider, ToastTitle, ToastViewport,} from "./toastnew";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.filter(el => el.open).map(function ({ id, title, description, action, ...props }, i) {
				return (
					<Toastnew
						duration={100000000}
						key={id}
						{...props}
						className="group-hover:!translate-3d-0"
						style={
							{
								"--tw-translate-x": 0,
								"--tw-translate-y": `${-85 * i}px`,
								"--tw-translate-z": `${-1 * i}px`,
								transform: `translate3d(0px, calc(${
									-70 * (i > 0 ? 1 : 0)
								}px + ${100 * (i > 0 ? 1 : 0)}% + ${-20 * i}px), ${
									-1 * i
								}px) scale(${1 - i * 0.05})`,
							} as React.CSSProperties
						}
					>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toastnew>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
