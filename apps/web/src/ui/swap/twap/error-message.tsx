export const ErrorMessage = ({
  title,
  detail,
}: { title: string; detail?: string }) => {
  return (
    <div className="rounded-xl bg-red/10 text-red text-sm flex flex-col gap-1 items-start p-4 min-h-[50px]">
      <div className="font-medium">{title}</div>
      {detail ? <div>{detail}</div> : null}
    </div>
  )
}
