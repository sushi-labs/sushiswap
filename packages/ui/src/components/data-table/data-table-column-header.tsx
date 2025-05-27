"use client";

import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { type Header, flexRender } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";

import classNames from "classnames";
import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

type DataTableColumnHeaderProps<TData, TValue> = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
	header: Header<TData, TValue>;
};

export function DataTableColumnHeader<TData, TValue>({ header }: DataTableColumnHeaderProps<TData, TValue>) {
	const onClick = useCallback(() => {
		if (header.column.getIsSorted() === false) {
			// desc
			header.column.toggleSorting(true);
		}

		if (header.column.getIsSorted() === "desc") {
			// asc
			header.column.toggleSorting(false);
		}

		if (header.column.getIsSorted() === "asc") {
			// clear
			header.column.clearSorting();
		}
	}, [header.column]);

	if (!column.getCanSort()) {
		return (
			<div className={className}>
				{description ? (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>{Title}</TooltipTrigger>
							<TooltipContent>{description}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				) : (
					<>{Title}</>
				)}
			</div>
		);
	}

	return (
		<div className={classNames("flex items-center space-x-2", className)}>
			{description ? (
				<Button onClick={onClick} variant="ghost" size="xs">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex flex-row gap-2 ui-items-center">
									<span className="underline decoration-dotted underline-offset-2">{title}</span>
									{column.getIsSorted() === "desc" ? (
										<CaretDownIcon className="w-4 h-4 ml-2" />
									) : column.getIsSorted() === "asc" ? (
										<CaretUpIcon className="w-4 h-4 ml-2" />
									) : (
										<CaretSortIcon className="w-4 h-4 ml-2" />
									)}
								</div>
							</TooltipTrigger>
							<TooltipContent>{description}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Button>
			) : (
				<Button onClick={onClick} variant="ghost" size="xs">
					<span>{title}</span>
					{column.getIsSorted() === "desc" ? (
						<CaretDownIcon className="w-4 h-4 ml-2" />
					) : column.getIsSorted() === "asc" ? (
						<CaretUpIcon className="w-4 h-4 ml-2" />
					) : (
						<CaretSortIcon className="w-4 h-4 ml-2" />
					)}
				</Button>
			)}
		</div>
	);
}
