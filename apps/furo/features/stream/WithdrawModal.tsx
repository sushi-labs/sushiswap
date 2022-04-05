// import { useState } from "react"
// import { FC } from "react"
// import { Dialog } from "ui"
// import DialogContent from "ui/dialog/DialogContent"
// import { useContract, useSigner } from "wagmi"
// import FuroStreamABI from '../../abis/FuroStream.json'

// const WithdrawModal: FC = () => {
//     let [isOpen, setIsOpen] = useState(false)
//     const [amount, setAmount] = useState<number>()
//     const [{ data, error, loading }, getSigner] = useSigner()
//     const contract = useContract({
//       addressOrName: '0x511D5aef6eb2eFDf71b98B4261Bbe68CC0A94Cd4',
//       contractInterface: FuroStreamABI,
//       signerOrProvider: data,
//     })
  
//     function closeModal() {
//       setIsOpen(false)
//     }
  
//     function openModal() {
//       setIsOpen(true)
//     }

    
//   async function withdraw() {
//     if (amount) {
//       const address = await data.getAddress()
//       contract.withdrawFromStream(stream.id, amount, address, true, '0x')
//     } else {
//       console.log('insufficient amount')
//     }
//   }


//   return (
//     <>
//     <button type="button" onClick={openModal} className="font-medium text-white">
//     Withdraw
//     </button>
//     <Dialog open={isOpen} onClose={closeModal}>
// <DialogContent>
//   {/* TODO: replace with Select component from ui package */}

//   <div className="text-blue-600">
//     <div>
//       How much do you want to withdraw?
//       <input
//         type={'number'}
//         defaultValue={500000}
//         onChange={(e) => setAmount(parseInt(e.target.value))}
//       ></input>
//     </div>

//     <button onClick={withdraw}>Withdraw</button>
//   </div>
// </DialogContent>
// </Dialog>
//     </>
//   )
// }
// export default WithdrawModal
