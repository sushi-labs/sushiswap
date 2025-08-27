export const CustomMessage = ({ message }: { message: string }) => {
  return (
    <div className="w-full p-3 bg-blue/[0.08] dark:bg-skyblue/[0.08] rounded-xl">
      <p className="text-sm text-blue dark:text-skyblue font-medium">
        {message}
      </p>
    </div>
  )
}
