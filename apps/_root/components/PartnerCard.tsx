const PartnerCard = ({ logoUrl, name, url }) => {
  return (
    <>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-row space-x-6">
          <div className="flow-root mx-auto rounded-lg">
            <div className="mx-auto text-center">
              <img className="h-auto mx-auto text-center" style={{ width: '111px' }} src={logoUrl} alt="" />
              <p className="mt-2 text-base text-gray-500">{name}</p>
            </div>
          </div>
        </div>
      </a>
    </>
  )
}

export default PartnerCard
