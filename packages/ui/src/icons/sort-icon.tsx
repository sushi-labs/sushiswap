import type { IconComponent } from '../types'

export const SortIcon: IconComponent = (props) => {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2.5C1 2.22386 1.22386 2 1.5 2H10.5C10.7761 2 11 2.22386 11 2.5C11 2.77614 10.7761 3 10.5 3H1.5C1.22386 3 1 2.77614 1 2.5ZM2.5 6C2.5 5.72386 2.72386 5.5 3 5.5H9C9.27614 5.5 9.5 5.72386 9.5 6C9.5 6.27614 9.27614 6.5 9 6.5H3C2.72386 6.5 2.5 6.27614 2.5 6ZM4 9.5C4 9.22386 4.22386 9 4.5 9H7.5C7.77614 9 8 9.22386 8 9.5C8 9.77614 7.77614 10 7.5 10H4.5C4.22386 10 4 9.77614 4 9.5Z"
        fill="currentColor"
      />
    </svg>
  )
}
