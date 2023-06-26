import { FC, useRef } from "react";

export const SwapCurrencyInput: FC = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="relative flex items-center gap-4">
        <input
            type="text"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            autoComplete="new-password"
            pattern='^[0-9]*[.,]?[0-9]*$'
            placeholder="0"
            min="0"
            minLength={1}
            maxLength={79}
            className="text-gray-900 dark:text-slate-50 text-left text-base font-medium bg-white bg-opacity-[0.06] focus-within:ring-2 focus:outline-none border-none focus:ring-2 focus:ring-offset-2 focus-within:ring-offset-2 ring-blue focus:ring-blue focus-within:ring-blue py-3 px-4 w-0 p-0 text-2xl bg-transparent p-3 bg-white dark:bg-slate-800 rounded-xl"
        />
        </div>
    )
}