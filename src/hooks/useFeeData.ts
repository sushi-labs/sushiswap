import { FeeData } from '@ethersproject/abstract-provider'
import { ChainId } from '@sushiswap/core-sdk'
import { EIP_1559_ACTIVATION_BLOCK } from 'app/constants'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { useActiveWeb3React } from 'app/services/web3'
import { useEffect, useState } from 'react'

interface FeeDataExtend extends FeeData {
  eip1559: boolean
}

type UseFeeData = () => FeeDataExtend

const useFeeData: UseFeeData = () => {
  const { chainId, library } = useActiveWeb3React()
  const blockNumber = useBlockNumber()

  // FeeData uses null..
  const [feeData, setFeeData] = useState<FeeData>({
    maxFeePerGas: null,
    maxPriorityFeePerGas: null,
    gasPrice: null,
  })

  const eip1559 =
    !!chainId && !!blockNumber ? blockNumber >= Number(EIP_1559_ACTIVATION_BLOCK[chainId as ChainId]) : false

  // Call this useEffect every block
  useEffect(() => {
    const init = async () => {
      return library?.getFeeData()
    }

    init().then((feeData) => {
      if (feeData) {
        setFeeData(feeData)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, blockNumber])

  return {
    ...feeData,
    eip1559,
  }
}

export default useFeeData
