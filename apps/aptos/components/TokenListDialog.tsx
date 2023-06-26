import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import DEFAULT_TOKEN_LIST from './../config/tokenList.json'
import TokenListItem from './TokenListItem'
type PropType = {
	open: boolean,
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function TokenListDialog({ open, setOpen }: PropType) {
	console.log(DEFAULT_TOKEN_LIST.tokens)
	return (
		<Transition appear show={open} as={Fragment}>
			<Dialog as="div" className="relative z-[1080]" onClose={() => setOpen(false)}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 paper bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="flex flex-col gap-3 !pb-1 min-h-[75vh] sm:min-h-[60vh] px-4 sm:!rounded-[24px] p-4 overflow-hidden text-left max-w-md inline-block w-full h-full bg-gray-50/80 paper dark:bg-slate-800/80 shadow-xl align-middle transition-all transform rounded-t-2xl rounded-b-none sm:rounded-2xl relative">
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-white"
								>
									Tokens
								</Dialog.Title>
								{DEFAULT_TOKEN_LIST.tokens.map((token, key) => {
									return <TokenListItem token={token} key={key} />
									return (
										<div className="py-0.5 h-[64px]">
											<div className="flex items-center w-full h-full rounded-lg px-3">
												<div className="flex items-center justify-between flex-grow gap-2 rounded">
													<div className="flex flex-row items-center flex-grow gap-4">
														<img src={token.logoURI} alt="" height={40} width={40} />
														<div className="flex flex-col items-start">
															<span className="font-semibold text-gray-900 group-hover:text-gray-900 dark:text-slate-50 group-hover:dark:text-white">
																{token.symbol}
															</span>
															<span className="text-sm text-gray-500 dark:text-slate-400 group-hover:dark:text-blue-100">
																{token.name}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									)
								})}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
