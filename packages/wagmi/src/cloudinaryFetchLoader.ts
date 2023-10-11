import { ImageLoaderProps } from 'next/image'

const normalizeSrc = (src: string) => (src[0] === '/' ? src.slice(1) : src)

export function cloudinaryFetchLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')]
  return `https://cdn.sushi.com/sushi-cdn/image/fetch/${params.join(
    ',',
  )}/${normalizeSrc(src)}`
}

export function cloudinaryImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps) {
  const params = ['f_auto', 'c_limit', 'w_' + width, 'q_' + (quality || 'auto')]
  return `https://cdn.sushi.com/sushi-cdn/image/upload/${params.join(
    ',',
  )}/${normalizeSrc(src)}`
}
