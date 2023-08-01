'use client'

import { ChainId } from '@sushiswap/chain'
import { TextField, TextFieldProps } from '@sushiswap/ui'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { useEnsResolver } from 'wagmi'

function Component(props: Omit<TextFieldProps<'text'>, 'type'>, ref: ForwardedRef<HTMLInputElement>) {
  const [state, setState] = useState({
    name: '',
    address: '',
  })

  useEnsResolver({
    name: `${props.value}`,
    chainId: ChainId.ETHEREUM,
    enabled: Boolean(props.value && typeof props.value === 'string' && props.value.length > 2),
    onSuccess(data) {
      if (props.onValueChange && data) {
        setState({ name: data.name, address: data.address })
        props.onValueChange(data.address)
      }
    },
  })

  useEffect(() => {
    if (!props.value) {
      setState({ name: '', address: '' })
    }
  }, [props.value])

  return <TextField {...props} type="text" ref={ref} />
}

export const EnsInput = forwardRef(Component)
