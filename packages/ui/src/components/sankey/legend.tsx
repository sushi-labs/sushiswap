import { getColorForSource } from "./utils";

export const Legend = ({ liquidityProviders }: { liquidityProviders: string[] }) => {
  return (
    <div className='gap-x-3 pt-6 flex flex-wrap max-w-[95%]'>
      {liquidityProviders.map((lp) => (
        <div
          key={lp}
          className='flex items-center mb-2'
        >
          <div
            className='w-3 h-3 md:w-5 md:h-5 md:rounded-md rounded-[.25rem]'
            style={{ backgroundColor: getColorForSource(lp) }}
          ></div>
          <span className='ml-2 text-[.625rem] md:text-sm text-gray-700'>{lp}</span>
        </div>
      ))}
    </div>
  );
};