import Image from "next/image";
import { IToken } from "src/types/token-type";
import { hashStringToColor } from "src/utils/formatters";

type IconProps = {
	currency: IToken | undefined;
	height?: number;
	width?: number;
};

export const Icon = ({ currency, height = 40, width = 40 }: IconProps) => {
	return (
		<>
			{currency?.logoURI ? (
				<Image src={currency?.logoURI} alt="" className="rounded-full" height={height} width={width} />
			) : (
				<div
					className="text-xs text-white font-bold rounded-full flex items-center justify-center bg-gradient-to-b from-gray-300 to-gray-200 dark:from-blue-700 dark:to-blue-900"
					style={{
						width: `${width}px`,
						height: `${height}px`,
						background: hashStringToColor(`${currency?.symbol} ${currency?.name}` ?? "??"),
					}}>
					{currency?.symbol?.substring(0, 2) ?? "??"}
				</div>
			)}
		</>
	);
};
