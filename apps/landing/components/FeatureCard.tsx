import Image from 'next/image'

const FeatureCard = ({ imgUrl, marginLeft, title, description, paddingRight = false }) => {
  return (
    <>
      <div className={`flex flex-row space-x-6 ` + (marginLeft && `ml-0 sm:ml-20`) + (paddingRight ? ` pr-10` : '')}>
        <div className="flow-root px-8 py-8 rounded-lg bg-neutral-800" style={{ width: '281px', height: '255px' }}>
          <div className="mx-auto text-center">
            <Image className="mx-auto text-center" width={111} height={111} src={imgUrl} alt={title} />
            <h3 className="mt-2 text-4xl font-semibold tracking-tight text-white">{title}</h3>
            <p className="mt-2 text-base text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default FeatureCard
