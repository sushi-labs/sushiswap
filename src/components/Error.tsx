// @ts-ignore
function Error({ statusCode }) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center">
      <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>
    </div>
  )
}

// @ts-ignore
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
