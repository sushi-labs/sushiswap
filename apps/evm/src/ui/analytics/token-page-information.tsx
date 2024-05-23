// 'use client'

// import { ExternalLinkIcon } from '@heroicons/react-v1/solid'
// import { Token as GraphToken } from '@sushiswap/graph-client'
// import { ClipboardController, LinkExternal } from '@sushiswap/ui'
// import { Currency } from '@sushiswap/ui/components/currency'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@sushiswap/ui/components/table'
// import { FC } from 'react'
// import { Chain } from 'sushi/chain'
// import { shortenAddress } from 'sushi/format'

// import { useTokenFromToken } from '../../lib/hooks/useTokenFromToken'

// interface TokenInformation {
//   token: GraphToken
// }

// export const TokenInformation: FC<TokenInformation> = ({ token }) => {
//   const _token = useTokenFromToken(token)
//   const chain = Chain.from(_token.chainId) as Chain

//   return (
//     <div className="flex flex-col w-full gap-4">
//       <p className="font-semibold  text-slate-50">Token Information</p>
//       <Table>
//         <TableHeader>
//           <TableHead>
//             <div className="text-left">Symbol</div>
//           </TableHead>
//           <TableHead>
//             <div className="text-left">Name</div>
//           </TableHead>
//           <TableHead>
//             <div className="text-left">Address</div>
//           </TableHead>
//           <TableHead>
//             <div className="text-left">Action</div>
//           </TableHead>
//         </TableHeader>
//         <TableBody>
//           <TableRow>
//             <TableCell>
//               <p className="font-semibold text-sm text-slate-100">
//                 {_token.symbol}
//               </p>
//             </TableCell>
//             <TableCell>
//               <div className="flex items-center gap-2">
//                 <Currency.Icon currency={_token} width={24} height={24} />
//                 <p className="font-medium text-sm text-slate-100">
//                   {_token.name}
//                 </p>
//               </div>
//             </TableCell>
//             <TableCell>
//               <ClipboardController>
//                 {({ setCopied }) => (
//                   <span
//                     onClick={() => setCopied(_token.wrapped.address)}
//                     onKeyDown={() => setCopied(_token.wrapped.address)}
//                     className="text-sm font-medium"
//                   >
//                     {shortenAddress(_token.wrapped.address)}
//                   </span>
//                 )}
//               </ClipboardController>
//             </TableCell>
//             <TableCell>
//               <LinkExternal
//                 href={chain.getTokenUrl(_token.wrapped.address)}
//                 className="flex items-center gap-1 !no-underline"
//               >
//                 <p className="font-medium text-sm text-slate-100">View</p>
//                 <ExternalLinkIcon width={18} height={18} />
//               </LinkExternal>
//             </TableCell>
//           </TableRow>
//         </TableBody>
//       </Table>
//     </div>
//   )
// }
