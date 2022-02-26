const ProductCard = ({ imgUrl, marginLeft, title, description, cta, ctaLink, customSize, paddingRight = false }) => {
  return (
    <>
      <div className={`flex flex-row space-x-6 ` + (marginLeft && `ml-0 sm:ml-20`) + (paddingRight && ` pr-10`)}>
        <div className={'flow-root bg-neutral-800 rounded-lg px-8 pb-8'} style={{ width: '281px', height: '255px' }}>
          <div className="mx-auto -mt-16 text-center">
            <div
              className="relative inline-flex items-center justify-center overflow-hidden rounded-full shadow-lg"
              style={{
                backgroundImage: `linear-gradient(224.43deg, #0D0415 -16.69%, #1B2152 86.36%)`,
                backgroundPosition: 'center bottom',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '123px',
                height: '123px',
              }}
            >
              <img className={`${customSize ? customSize : 'w-20 h-20'} p-2`} alt={title} src={imgUrl} />
            </div>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{description}</p>
            <div
              className="mt-4 rounded-md shadow"
              style={{ backgroundImage: 'linear-gradient(to right, #016eda, #d900c0)' }}
            >
              <a
                href={ctaLink}
                className="flex items-center justify-center w-full px-6 py-2 text-base font-medium text-white border border-transparent rounded-md"
              >
                {cta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
