// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@sushiswap/ui'
// import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
// import { FC } from 'react'
// import { SUPPORTED_CHAIN_IDS, NEW_CHAINS } from 'src/config'

// export const Sidebar: FC = () => {
//   return (
//     <div className="w-[205px] border-r border-muted-foreground">
//       <SushiWithTextIcon
//         height={20}
//         className="text-gray-700 dark:text-slate-50"
//       />
//       <div className="px-1 py-3">
//         <span className="px-3 text-xs text-muted-foreground">
//           Browse Network
//         </span>
//         <div className="p-3">
//           <Command>
//             <CommandInput
//               testdata-id="network-selector-input"
//               placeholder="Search network"
//             />
//             <CommandEmpty>No network found.</CommandEmpty>
//             <CommandGroup>
//                 <Link
//                   href="https://aptos.sushi.com"
//                   rel="noopener noreferrer"
//                   target="_blank"
//                 >
//                   <CommandItem className="cursor-pointer">
//                     <div className="flex items-center gap-2">
//                       <AptosCircle width={22} height={22} />
//                       Aptos
//                     </div>
//                   </CommandItem>
//                 </Link>
//               {SUPPORTED_CHAIN_IDS
//                 .sort((a) => (NEW_CHAINS.includes(a) ? -1 : 0))
//                 .map((el) => (
//                   <CommandItem
//                     className="cursor-pointer"
//                     testdata-id={`network-selector-${el}`}
//                     value={`${Chain.from(el)?.name}__${el}`}
//                     key={el}
//                     onSelect={(value) =>
//                       onSelect(+value.split('__')[1] as T, () => setOpen(false))
//                     }
//                   >
//                     <div className="flex items-center gap-2">
//                       <NetworkIcon chainId={el} width={22} height={22} />
//                       {NEW_CHAINS.includes(el) ? (
//                         <>
//                           {Chain.from(el)?.name}
//                           <div className="text-[10px] italic rounded-full px-[6px] bg-gradient-to-r from-blue to-pink text-white font-bold">
//                             NEW
//                           </div>
//                         </>
//                       ) : (
//                         Chain.from(el)?.name
//                       )}
//                     </div>
//                   </CommandItem>
//                 ))}
//             </CommandGroup>
//           </Command>
//         </div>
//       </div>
//     </div>
//   )
// }
