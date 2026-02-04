'use client'

import { useIsMounted } from '@sushiswap/hooks'
import {
  Button,
  type ButtonProps,
  // Checkbox,
  // Dialog,
  // DialogContent,
  // DialogDescription,
  // DialogHeader,
  // DialogTitle,
  // DialogTrigger,
} from '@sushiswap/ui'
import { Dots } from '@sushiswap/ui'
// import { useQueryClient } from '@tanstack/react-query'
import type {
  FC,
  //  useCallback,
  // useState
} from 'react'
import { useLegalCheck } from 'src/lib/perps/info/use-legal-check'
// import { parseSignature } from 'viem'
import {
  useAccount,
  // useDisconnect, useSignTypedData
} from 'wagmi'

const Legal: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'lg',
  ...props
}) => {
  const isMounted = useIsMounted()

  const { address } = useAccount()
  const { data, isLoading, error } = useLegalCheck({ address })

  if (!isMounted)
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        <div className="h-[1ch]" />
      </Button>
    )

  if (isLoading) {
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        <Dots>Checking Legal</Dots>
      </Button>
    )
  }

  if (error) {
    return (
      <Button fullWidth={fullWidth} size={size} {...props}>
        {error?.message || 'Error Checking Legal'}
      </Button>
    )
  }

  if (!data?.ipAllowed)
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        Jurisdiction Not Allowed
      </Button>
    )

  if (!data?.userAllowed)
    return (
      <Button fullWidth={fullWidth} size={size} disabled {...props}>
        User Not Allowed
      </Button>
    )

  //@dev @todo - do we need our own legal check?
  // if (!data?.acceptedTerms)
  //   return <LegalDialog fullWidth={fullWidth} size={size} {...props} />

  return <>{children}</>
}

export { Legal }

// const LegalDialog: FC<ButtonProps> = ({
//   children,
//   fullWidth = true,
//   size = 'lg',
//   ...props
// }) => {
//   const [accepted, setAccepted] = useState({
//     termsAndPp: false,
//     cookies: false,
//   })
//   const { disconnectAsync } = useDisconnect()
//   const { address, chainId } = useAccount()
//   const { signTypedDataAsync } = useSignTypedData()
//   const { invalidateQueries } = useQueryClient()
//   const [isPending, setIsPending] = useState(false)

//   const handleSignedTypedData = useCallback(async () => {
//     if (!chainId || !address) return
//     try {
//       setIsPending(true)
//       const signature = await signTypedDataAsync({
//         domain: {
//           name: 'HyperliquidSignTransaction',
//           version: '1',
//           chainId: BigInt(chainId),
//           verifyingContract: '0x0000000000000000000000000000000000000000',
//         },
//         message: {
//           //@ts-expect-error - needed type for
//           type: 'acceptTerms',
//           time: BigInt(Date.now()),
//           hyperliquidChain: 'Mainnet',
//           signatureChainId: `0x${chainId.toString(16)}`,
//         },
//         primaryType: 'Hyperliquid:AcceptTerms',
//         types: {
//           EIP712Domain: [
//             { name: 'name', type: 'string' },
//             { name: 'version', type: 'string' },
//             { name: 'chainId', type: 'uint256' },
//             { name: 'verifyingContract', type: 'address' },
//           ],
//           'Hyperliquid:AcceptTerms': [
//             { name: 'hyperliquidChain', type: 'string' },
//             { name: 'time', type: 'uint64' },
//           ],
//         },
//       })
//       const { r, s, v } = parseSignature(signature)

//       const data = await res.json()
//       console.log('Legal acceptance response:', data)
//       invalidateQueries({ queryKey: ['useLegalCheck', address] })
//       setIsPending(false)
//     } catch (error) {
//       console.log('Error signing typed data:', error)
//       setIsPending(false)
//     } finally {
//       setIsPending(false)
//     }
//   }, [signTypedDataAsync, chainId, address, invalidateQueries])

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button fullWidth={fullWidth} size={size} {...props}>
//           Accept Terms and Conditions
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader className="!text-left">
//           <DialogTitle>
//             Terms of Use, Privacy Policy, and Cookie Policy
//           </DialogTitle>
//           <DialogDescription>
//             To proceed, review and accept the following
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex flex-col gap-6 text-sm">
//           <div className="flex flex-col gap-4 text-sm">
//             <div
//               onClick={() => {
//                 setAccepted({ ...accepted, termsAndPp: !accepted.termsAndPp })
//               }}
//               onKeyDown={() => {
//                 setAccepted({ ...accepted, termsAndPp: !accepted.termsAndPp })
//               }}
//               className="flex items-center gap-1 text-xs font-medium"
//             >
//               <Checkbox
//                 className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
//                 checked={accepted.termsAndPp}
//                 onCheckedChange={(checked) => {
//                   setAccepted({ ...accepted, termsAndPp: Boolean(checked) })
//                 }}
//               />
//               <div>
//                 You acknowledge that you ahve readm understood, and agreed to
//                 the Terms of Use and Privacy Policy.
//               </div>
//             </div>
//             <div
//               onClick={() => {
//                 setAccepted({ ...accepted, cookies: !accepted.cookies })
//               }}
//               onKeyDown={() => {
//                 setAccepted({ ...accepted, cookies: !accepted.cookies })
//               }}
//               className="flex items-center gap-1 text-xs font-medium"
//             >
//               <Checkbox
//                 className='data-[state="checked"]:!bg-blue text-slate-100 !border-slate-100 data-[state="checked"]:!border-blue'
//                 checked={accepted.cookies}
//                 onCheckedChange={(checked) => {
//                   setAccepted({ ...accepted, cookies: Boolean(checked) })
//                 }}
//               />
//               <div>
//                 This site uses cookies to ensure the best user experience. These
//                 cookies are strictly necessary or essential for optimal
//                 functionality. By using this site, you agree to the cookie
//                 policy.
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               fullWidth
//               variant="secondary"
//               onClick={async () => {
//                 await disconnectAsync()
//               }}
//             >
//               Decline
//             </Button>
//             <Button
//               fullWidth
//               onClick={async () => await handleSignedTypedData()}
//               loading={isPending}
//               disabled={!accepted.cookies || !accepted.termsAndPp}
//             >
//               Confirm
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
