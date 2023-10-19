"use client";

import {ToasterToast, useToast} from "./use-toast";
import {
	ToastCaption,
	ToastClose,
	ToastDescription,
	Toastnew,
	ToastProvider,
	ToastViewport,
	ToastVisual,
} from "./toastnew";
import {classNames} from "../index";

const TOAST_HEIGHT = 70;
const TOAST_VISUAL_HEIGHT = 128;

const calculateMaxHeights = (toasts: ToasterToast[]) => {
	const heights = toasts.map((toast) => {
		let maxHeight = TOAST_HEIGHT;
		if (toast.visual) {
			maxHeight += TOAST_VISUAL_HEIGHT;
		}

		return maxHeight;
	});

	const firstElement = heights[0];
	let hoverTranslateY = 0;
	const paddingBetweenToasts = 20;
	return heights.map((height, i) => {
		const data = {
			hoverTranslateY,
			hoverHeight: height,
			translateY: i === 0 ? 0 : firstElement,
			stackedHeight: height > firstElement ? firstElement : height,
			isReduced: height > firstElement,
			scale: 1 - i * 0.05,
		};

		hoverTranslateY += height + paddingBetweenToasts;
		return data;
	});
};

export function Toaster() {
	const { toasts } = useToast();
	const heights = calculateMaxHeights(toasts);

	return (
		<ToastProvider>
			{toasts
				.filter((el) => el.open)
				.map(function (
					{ id, description, visual, action, caption, ...props },
					i,
				) {
					const {
						hoverTranslateY,
						translateY,
						stackedHeight,
						hoverHeight,
						isReduced,
						scale,
					} = heights[i];

					return (
						<Toastnew
							duration={100000000}
							key={id}
							{...props}
							className={classNames(
								"h-[var(--maxHeight)]",
								isReduced ? "overflow-hidden group-hover:overflow-visible" : "",
								"group-hover:!translate-3d-0 group-hover:!max-h-[var(--maxHeight)]",
							)}
							style={
								{
									maxHeight: `${stackedHeight}px`,
									"--maxHeight": `${hoverHeight}px`,
									"--tw-translate-x": 0,
									"--tw-translate-y": `${-hoverTranslateY}px`,
									"--tw-translate-z": `${-1 * i}px`,
									transform: `translate3d(0px, calc(${-translateY}px + ${
										100 * (i > 0 ? 1 : 0)
									}% + ${-20 * i}px), ${-1 * i}px) scale(${scale})`,
								} as React.CSSProperties
							}
						>
							{visual && <ToastVisual>{visual}</ToastVisual>}
							{description && (
								<ToastDescription className="max-h-[70px]">
									{caption ? <ToastCaption variant={props.variant}>{caption}</ToastCaption> : null}
									{description}
									<ToastClose />
								</ToastDescription>
							)}
							{action}
						</Toastnew>
					);
				})}
			<ToastViewport />
		</ToastProvider>
	);
}
