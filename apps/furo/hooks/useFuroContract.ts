import FuroExport from 'furo/exports/kovan.json'
import { FuroStream } from 'furo/typechain/FuroStream'
import { useContract, useNetwork, useSigner } from "wagmi"

export function useFuroContract(): FuroStream | null {
    // const [{ data: network }] = useNetwork()
    // const [{ data: signer }] = useSigner()
    // const chainId = network?.chain?.id
    // TODO: fix chainId, signer?
    return useContract<FuroStream>({
      addressOrName: FuroExport[42].kovan.contracts.FuroStream.address,
      contractInterface: FuroExport[42].kovan.contracts.FuroStream.abi
    })
  }
  