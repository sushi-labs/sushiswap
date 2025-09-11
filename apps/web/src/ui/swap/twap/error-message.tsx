export const ErrorMessage = ({
  title,
  detail,
}: { title: string; detail?: string }) => {
  return (
    <div className="rounded-xl bg-[#DE58521A] text-[#DE5852] text-sm flex flex-col gap-1 items-start p-4 min-h-[50px]">
      <div className="font-medium">{title}</div>
      {detail ? <div>{detail}</div> : null}
    </div>
  )
}
