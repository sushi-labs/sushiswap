import { FormType } from '../page'
import { HTMLAttributes, RefObject } from 'react'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Resizer from 'react-image-file-resizer'

function adjust(color: string, amount: number) {
  return '#' +
  color
    .replace(/^#/, '')
    .replace(/../g, (color) =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

interface ImageCanvas extends HTMLAttributes<HTMLCanvasElement> {
  size: number
  canvasRef: RefObject<HTMLCanvasElement>
}

export const ImageCanvas: FC<ImageCanvas> = ({ size, canvasRef, ...props }) => {
  const { watch, setValue } = useFormContext<FormType>()
  const [logoUri, logoFile, logoSize, background] = watch(['logoUri', 'logoFile', 'logoSize', 'background'])

  useEffect(() => {
    if (canvasRef?.current && background) {
      const ctx = canvasRef.current.getContext('2d')

      if (!ctx) return

      const grd = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size)
      grd.addColorStop(0, background)
      grd.addColorStop(1, adjust(background, -100))

      ctx.fillStyle = grd
      ctx.fillRect(0, 0, size, size)

      if (logoUri) {
        const image = new Image()
        image.src = logoUri
        image.onload = () => {
          ctx.drawImage(image, size / 2 - image.width / 2, size / 2 - image.height / 2)
        }
      }
    }
  }, [canvasRef, background, logoUri, size])

  useEffect(() => {
    if (logoFile) {
      Resizer.imageFileResizer(
        logoFile,
        logoSize,
        logoSize,
        'PNG',
        100,
        0,
        (uri) => setValue('logoUri', uri as string),
        'base64',
        0,
        0
      )
    }
  }, [logoFile, logoSize, setValue])

  return <canvas {...props} ref={canvasRef} width={size} height={size} />
}
