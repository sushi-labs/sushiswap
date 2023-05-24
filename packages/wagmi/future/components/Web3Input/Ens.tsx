import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Input } from '@sushiswap/ui/future/components/input'
import { useEnsResolver } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { TextInput } from '@sushiswap/ui/future/components/input/Text'

export type EnsInputProps = TextInput

function Component(props: EnsInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const [state, setState] = useState({
    name: '',
    address: '',
  })

  useEnsResolver({
    name: `${props.value}`,
    chainId: ChainId.ETHEREUM,
    enabled: Boolean(props.value && typeof props.value === 'string' && props.value.length > 2),
    onSuccess(data) {
      if (props.onChange && data) {
        setState({ name: data.name, address: data.address })
        props.onChange(data.address)
      }
    },
  })

  useEffect(() => {
    if (!props.value) {
      setState({ name: '', address: '' })
    }
  }, [props.value])

  return <Input.Text {...props} ref={ref} caption={state.name ? state.name : props.caption} />
}

export const EnsInput = forwardRef(Component)
