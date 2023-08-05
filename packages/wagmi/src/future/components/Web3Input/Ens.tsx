import { ChainId } from '@sushiswap/chain'
import { Input } from '@sushiswap/ui/components/input'
import { TextInput } from '@sushiswap/ui/components/input/Text'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { useEnsResolver } from 'wagmi'

export type EnsInputProps = TextInput

function Component(props: EnsInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const [address, setAddress] = useState('')

  useEnsResolver({
    name: `${props.value}`,
    chainId: ChainId.ETHEREUM,
    enabled: Boolean(props.value && typeof props.value === 'string' && props.value.length > 2),
    onSuccess(data) {
      if (props.onChange && data) {
        setAddress(data)
        props.onChange(data)
      }
    },
  })

  useEffect(() => {
    if (!props.value) {
      setAddress('')
    }
  }, [props.value])

  return <Input.Text {...props} ref={ref} />
}

export const EnsInput = forwardRef(Component)
