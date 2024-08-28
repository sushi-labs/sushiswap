"use client";
import { RemoveInput } from "./RemoveInput";
import { MinimumReceive } from "./MinimumReceive";
import { RemoveButton } from "./RemoveButton";

export const RemoveLiquidity = () => {
	return (
		<div className="flex flex-col gap-4">
			<RemoveInput />
			<MinimumReceive />
			<RemoveButton />
		</div>
	);
};
