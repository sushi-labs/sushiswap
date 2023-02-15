export default function PartnerLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
