export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-[0.5px] bg-accent w-full" />
      <div>{children}</div>
    </>
  )
}
