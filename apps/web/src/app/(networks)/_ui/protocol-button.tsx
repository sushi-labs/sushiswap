import { Button, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { SushiSwapProtocol } from 'sushi/evm'

export const ProtocolButton = ({
  protocol,
  selectedProtocol,
  ...props
}: {
  protocol: SushiSwapProtocol | 'SUSHISWAP_V4' | 'BLADE'
  selectedProtocol?: SushiSwapProtocol | 'SUSHISWAP_V4' | 'BLADE'
} & React.ComponentProps<typeof Button>) => {
  const baseColoringClassname = useMemo(() => {
    switch (protocol) {
      case SushiSwapProtocol.SUSHISWAP_V2:
        return '!bg-[#00000005] hover:!bg-[#F338C31A] hover:!border-[#F338C3] hover:!text-[#F338C3]'
      case SushiSwapProtocol.SUSHISWAP_V3:
        return '!bg-[#00000005] hover:!bg-[#3B7EF61A] hover:!border-[#3B7EF6] hover:!text-[#3B7EF6]'
      case 'SUSHISWAP_V4':
        return '!bg-[#00000005] hover:!bg-[#9E3FFF1A] hover:!border-[#9E3FFF] hover:!text-[#9E3FFF]'
      case 'BLADE':
        return '!bg-[#00000005] hover:!border-[#4217FF] hover:!text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue to-skyblue'
      default:
        return ''
    }
  }, [protocol])

  const selectedColoringClassname = useMemo(() => {
    if (
      selectedProtocol === SushiSwapProtocol.SUSHISWAP_V2 &&
      protocol === SushiSwapProtocol.SUSHISWAP_V2
    ) {
      return '!bg-[#F338C31A] !border-[#F338C3] text-[#F338C3] hover:!text-[#F338C3] !border-solid'
    }
    if (
      selectedProtocol === SushiSwapProtocol.SUSHISWAP_V3 &&
      protocol === SushiSwapProtocol.SUSHISWAP_V3
    ) {
      return '!bg-[#3B7EF61A] !border-[#3B7EF6] text-[#3B7EF6] hover:!text-[#3B7EF6] !border-solid'
    }
    if (selectedProtocol === 'SUSHISWAP_V4' && protocol === 'SUSHISWAP_V4') {
      return '!bg-[#9E3FFF1A] !border-[#9E3FFF] text-[#9E3FFF] hover:!text-[#9E3FFF] !border-solid'
    }
    if (selectedProtocol === 'BLADE' && protocol === 'BLADE') {
      return '!text-transparent bg-clip-text bg-gradient-to-r from-blue to-skyblue !border-[#4217FF] !border-solid'
    }
    return ''
  }, [selectedProtocol, protocol])

  const text = useMemo(() => {
    switch (protocol) {
      case SushiSwapProtocol.SUSHISWAP_V2:
        return 'V2'
      case SushiSwapProtocol.SUSHISWAP_V3:
        return 'V3'
      case 'SUSHISWAP_V4':
        return 'V4'
      case 'BLADE':
        return 'Blade'
      default:
        return 'No Protocol'
    }
  }, [protocol])

  return (
    <div
      className={classNames(
        'rounded-xl',
        selectedProtocol === 'BLADE' && protocol === 'BLADE'
          ? '!bg-[#0000001f]'
          : protocol === 'BLADE'
            ? 'hover:!bg-[#0000001f]'
            : '',
      )}
    >
      <Button
        variant="outline"
        className={classNames(
          'rounded-xl border-dashed',
          baseColoringClassname,
          selectedColoringClassname,
          props.className,
        )}
        {...props}
      >
        <span>{text}</span>
      </Button>
    </div>
  )
}
