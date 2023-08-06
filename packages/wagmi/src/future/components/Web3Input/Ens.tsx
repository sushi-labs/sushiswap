import { ChainId } from '@sushiswap/chain'
import { TextFieldProps } from '@sushiswap/ui'
import { TextField } from '@sushiswap/ui'
import { TextInput } from '@sushiswap/ui/components/input/Text'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { useEnsResolver } from 'wagmi'

export type EnsInputProps = TextInput

function Component(props: Omit<TextFieldProps<'text'>, 'type'>, ref: ForwardedRef<HTMLInputElement>) {
  const [address, setAddress] = useState('')

  useEnsResolver({
    name: `${props.value}`,
    chainId: ChainId.ETHEREUM,
    enabled: Boolean(props.value && typeof props.value === 'string' && props.value.length > 2),
    onSuccess(data) {
      if (props.onValueChange && data) {
        setAddress(data)
        props.onValueChange(data)
      }
    },
  })

  useEffect(() => {
    if (!props.value) {
      setAddress('')
    }
  }, [props.value])

  return <TextField {...props} type="text" ref={ref} />
}

export const EnsInput = forwardRef(Component)
