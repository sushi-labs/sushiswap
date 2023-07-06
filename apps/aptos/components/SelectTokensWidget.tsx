// import React, { FC } from 'react'
// import { ContentBlock } from './ContentBlock'
// import { Button } from '@sushiswap/ui/future/components/button'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
// import { classNames } from '@sushiswap/ui'
// import { TokenSelector } from '@sushiswap/wagmi/future/components/TokenSelector/TokenSelector'

// interface SelectTokensWidget {

// }

// export const SelectTokensWidget: FC <SelectTokensWidget> = ({})=> {
//   return (
//     <ContentBlock
//     title={
//       <>
//       Which <span className="text-gray-900 dark:text-white">token pair</span> would you like to add liquidity to?
//       </>
//     }
//     >
//       <div className='flex gap-3'>
//         <TokenSelector id={'token1-token-selector'}>
//           {({open,setOpen}) => (
//             <Button
//             size="xl"
//             variant="outlined"
//             color={'' ?'blue' : 'default'}
//             id={'token0-select-button'}
//             testId={'token0-select'}
//             onClick={() => setOpen(true)}
//             >
//               {}
//               <ChevronDownIcon
//                 width={24}
//                 height={24}
//                 className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
//               />
//             </Button>
//           )}
//         </TokenSelector>
//         <TokenSelector id={'token1-token-selector'}>
//           {({ open, setOpen }) => (
//             <Button
//               size="xl"
//               variant="outlined"
//               color={'' ? 'blue' : 'default'}
//               id={'token1-select-button'}
//               testId={'token1-select'}
//               onClick={() => setOpen(true)}
//             >
//               {}
//               <ChevronDownIcon
//                 width={24}
//                 height={24}
//                 className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
//               />
//             </Button>
//           )}
//         </TokenSelector>
//       </div>
//     </ContentBlock>
//   )
// }
