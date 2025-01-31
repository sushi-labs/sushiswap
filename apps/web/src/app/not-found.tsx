export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center font-sans">
      <div className="flex leading-[48px]">
        <h1 className="mr-5 inline-block border-r border-current pr-6 text-2xl font-medium text-opacity-30 align-top">
          404
        </h1>
        <div className="inline-block">
          <h2 className="text-sm font-normal leading-7">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  )
}
