'use client'

import { TextField, type TextFieldProps } from '@sushiswap/ui'
import { type ForwardedRef, forwardRef, useEffect } from 'react'
import { EvmChainId } from 'sushi/evm'
import { useEnsAddress } from 'wagmi'

function Component(
  props: Omit<TextFieldProps<'text'>, 'type'>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { data } = useEnsAddress({
    name: `${props.value}`,
    chainId: EvmChainId.ETHEREUM,
    query: {
      enabled: Boolean(
        props.value &&
          typeof props.value === 'string' &&
          props.value.length > 2,
      ),
    },
  })

  useEffect(() => {
    if (typeof data === 'string' && props.onValueChange) {
      props.onValueChange(data)
    }
  }, [data, props.onValueChange])

  // useEnsResolver({
  //   name: `${props.value}`,
  //   chainId: ChainId.ETHEREUM,
  //   enabled: Boolean(props.value && typeof props.value === 'string' && props.value.length > 2),
  //   onSuccess(data) {
  //     console.log(data)

  //     if (props.onValueChange && data) {
  //       props.onValueChange(data)
  //     }
  //   },
  // })

  return <TextField {...props} type="text" ref={ref} />
}

export const EnsInput = forwardRef(Component)
