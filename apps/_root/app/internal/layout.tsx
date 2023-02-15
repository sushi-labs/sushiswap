export default function InternalLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
