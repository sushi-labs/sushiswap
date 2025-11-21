import type { NakedNetworkIconComponent } from '../../../types'

export const MonadNaked: NakedNetworkIconComponent = ({ circle, ...props }) => {
  return (
    <svg
      viewBox="0 0 126.609 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {circle}
      <path
        d="M62.982 0C44.793 0 0 45.398 0 63.833s44.794 63.833 62.982 63.833 62.982-45.4 62.982-63.833C125.964 45.398 81.17 0 62.982 0m-9.815 100.334c-7.67-2.118-28.289-38.675-26.2-46.449s38.16-28.672 45.83-26.553 28.29 38.675 26.2 46.448-38.16 28.673-45.83 26.554"
        fill={'#6e54ff'}
      />
    </svg>
  )
}
