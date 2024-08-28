import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: "SushiSwap on Tron",
};

export default function SwapLayout({ children }: { children: React.ReactNode }) {
	return <Providers>{children}</Providers>;
}
