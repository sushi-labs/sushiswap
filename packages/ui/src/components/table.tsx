import Link from 'next/link'
import * as React from 'react'

import classNames from 'classnames'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={classNames('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={classNames('[&_tr]:border-b', className)}
    {...props}
  />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={classNames('[&_tr:last-child]:border-0', className)}
    {...props}
  />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={classNames(
      'bg-primary font-medium text-primary-foreground',
      className,
    )}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={classNames(
      'border-b border-secondary black:border-white/[0.1] transition-colors hover:bg-secondary black:hover:bg-background hover:bg-opacity-50 data-[state=selected]:bg-secondary black:data-[state=selected]:bg-background',
      className,
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={classNames(
      'h-12 px-2 whitespace-nowrap text-left align-middle text-xs font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={classNames(
      'h-[76px] relative text-sm font-medium p-4 align-middle [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

interface TableCellAsLinkProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  href: string
  external: boolean
}

const TableCellAsLink = React.forwardRef<
  HTMLTableCellElement,
  TableCellAsLinkProps
>(({ external, className, children, href, ...props }, ref) => (
  <td className="!p-0 h-[76px]" ref={ref} {...props}>
    <Link
      scroll={false}
      shallow={true}
      href={href}
      target={external ? '_blank' : '_self'}
      className={classNames(
        'flex items-center text-sm font-medium p-4 py-1 align-middle [&:has([role=checkbox])]:pr-0',
        className,
      )}
    >
      {children}
    </Link>
  </td>
))
TableCellAsLink.displayName = 'TableCellAsLink'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={classNames('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellAsLink,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
