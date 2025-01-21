import { useId } from 'react'
import { IconComponent } from '../types'

export const OrbsIcon: IconComponent = (props) => {
  const idPrefix = useId()

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
      <g clipPath={`url(#${idPrefix}-a)`}>
        <g clipPath={`url(#${idPrefix}-b)}`}>
          <g clipPath={`url(#${idPrefix}-c)`}>
            <mask
              id="d"
              width={21}
              height={21}
              x={0}
              y={0}
              maskUnits="userSpaceOnUse"
              style={{
                maskType: 'alpha',
              }}
            >
              <path fill="#C4C4C4" d="M20.495.738h-20v19.524h20z" />
            </mask>
            <g mask={`url(#${idPrefix}-d)`}>
              <path
                fill={`url(#${idPrefix}-e)`}
                d="M6.234 13.192c-.057.216-.241.268-.404.115l-3.237-2.958c-.166-.153-.13-.344.082-.427l4.541-1.778c.213-.083.337.028.28.243z"
              />
              <path
                fill={`url(#${idPrefix}-f)`}
                d="M3.561 16.005c-.174.146-.347.087-.386-.136l-.887-4.808c-.039-.219.064-.274.23-.122L5.6 13.755a.35.35 0 0 1-.01.542z"
              />
              <path
                fill={`url(#${idPrefix}-g)`}
                d="M7.276 7.186c.15.17.096.375-.113.459L2.646 9.412c-.212.083-.319-.021-.24-.23l1.853-4.88c.078-.209.266-.244.415-.074z"
              />
              <path
                fill={`url(#${idPrefix}-h)`}
                d="M2.547 15.185c.04.219-.028.247-.152.06l-1.752-2.65a.62.62 0 0 1 .022-.666l.783-1.028c.135-.177.28-.146.323.073z"
              />
              <path
                fill={`url(#${idPrefix}-i)`}
                d="M1.994 8.884c-.078.208-.202.208-.276-.004l-.6-1.756a.67.67 0 0 1 .178-.656L3.43 4.575c.17-.149.24-.1.163.108z"
              />
              <path
                fill={`url(#${idPrefix}-j)`}
                d="M1.43 9.561a.85.85 0 0 1-.116.709l-.61.805c-.135.177-.227.142-.206-.08l.294-2.791c.025-.222.103-.23.174-.018z"
              />
              <path
                fill={`url(#${idPrefix}-k)`}
                d="M3.837 3.277c.075.087 0 .278-.17.43l-.957.851c-.17.15-.195.125-.06-.052l.805-1.059c.134-.18.308-.257.382-.17"
              />
              <path
                fill={`url(#${idPrefix}-l)`}
                d="M9.892 18.13c-.113.19-.315.2-.443.017L6.94 14.57c-.127-.184-.05-.354.178-.375l5.04-.51c.227-.025.32.114.203.308z"
              />
              <path
                fill={`url(#${idPrefix}-m)`}
                d="M8.843 18.133c.128.184.057.274-.156.205l-4.725-1.573c-.217-.073-.252-.25-.078-.396l2.024-1.708a.37.37 0 0 1 .55.07z"
              />
              <path
                fill={`url(#${idPrefix}-n)`}
                d="M12.264 12.856c.15.17.085.326-.142.35l-5.115.518c-.227.024-.365-.136-.308-.351l1.28-4.878c.056-.215.223-.253.372-.087z"
              />
              <path
                fill={`url(#${idPrefix}-o)`}
                d="M15.937 17.036c.149.17.088.344-.135.392l-5.204 1.073c-.223.045-.312-.073-.195-.267l2.453-4.11c.114-.192.33-.213.479-.043z"
              />
              <path
                fill={`url(#${idPrefix}-p)`}
                d="M7.567 19.779a.66.66 0 0 1-.674-.077l-2.417-2.09c-.17-.15-.135-.208.081-.139l4.134 1.375c.216.073.227.215.028.323z"
              />
              <path
                fill={`url(#${idPrefix}-q)`}
                d="M13.179 19.976a.7.7 0 0 1-.692.073l-1.684-.84c-.202-.1-.187-.222.036-.267l4.484-.924c.224-.045.263.032.085.174z"
              />
              <path
                fill={`url(#${idPrefix}-r)`}
                d="M8.485 20.077c-.227-.01-.248-.104-.05-.211l.904-.476a.92.92 0 0 1 .734-.007l1.319.656c.202.1.184.177-.046.167z"
              />
              <path
                fill={`url(#${idPrefix}-s)`}
                d="M16.777 17.987c.074.087-.025.243-.227.347l-1.187.622c-.203.104-.22.076-.047-.066l1.004-.802c.173-.143.379-.188.457-.101"
              />
              <path
                fill={`url(#${idPrefix}-t)`}
                d="M13.77 12.804c-.212.083-.336-.028-.28-.244l1.263-4.804c.056-.216.24-.268.407-.115l3.237 2.958c.167.153.131.344-.082.427z"
              />
              <path
                fill={`url(#${idPrefix}-u)`}
                d="M18.702 9.887c.039.22-.064.275-.23.122L15.39 7.193a.35.35 0 0 1 .01-.541l2.024-1.708c.174-.146.348-.087.387.135z"
              />
              <path
                fill={`url(#${idPrefix}-v)`}
                d="M16.727 16.647c-.078.208-.266.243-.415.073l-2.602-2.958c-.148-.17-.095-.375.114-.458l4.516-1.767c.213-.084.32.02.241.229z"
              />
              <path
                fill={`url(#${idPrefix}-w)`}
                d="M20.343 8.353a.62.62 0 0 1-.021.666l-.784 1.024c-.134.178-.28.146-.322-.072l-.777-4.208c-.038-.22.029-.247.153-.06z"
              />
              <path
                fill={`url(#${idPrefix}-x)`}
                d="M19.865 13.828a.67.67 0 0 1-.178.656l-2.134 1.892c-.17.15-.24.101-.163-.107l1.6-4.204c.077-.209.201-.209.276.003z"
              />
              <path
                fill={`url(#${idPrefix}-y)`}
                d="M20.198 12.741c-.025.223-.103.23-.174.018l-.468-1.375a.86.86 0 0 1 .117-.708l.613-.806c.135-.177.227-.142.206.08z"
              />
              <path
                fill={`url(#${idPrefix}-z)`}
                d="M17.532 17.501c-.135.18-.308.253-.387.17-.074-.087 0-.278.17-.43l.961-.851c.17-.15.195-.125.06.052z"
              />
              <path
                fill={`url(#${idPrefix}-A)`}
                d="M14.047 6.378c.128.183.05.354-.177.374l-5.04.51c-.228.025-.32-.114-.203-.308l2.467-4.135c.114-.191.316-.201.444-.017z"
              />
              <path
                fill={`url(#${idPrefix}-B)`}
                d="M15.079 6.287a.37.37 0 0 1-.55-.069l-2.385-3.402c-.128-.184-.057-.275.156-.205l4.725 1.573c.216.072.252.25.078.395z"
              />
              <path
                fill={`url(#${idPrefix}-C)`}
                d="M13.009 12.453c-.057.215-.224.254-.373.087l-3.91-4.447c-.149-.17-.085-.327.142-.351l5.115-.517c.227-.025.366.135.309.35z"
              />
              <path
                fill={`url(#${idPrefix}-D)`}
                d="M8.13 6.829c-.113.19-.33.212-.478.042L5.05 3.913c-.149-.17-.089-.344.135-.393l5.204-1.072c.223-.046.312.073.195.267z"
              />
              <path
                fill={`url(#${idPrefix}-E)`}
                d="M12.296 2.1c-.216-.073-.227-.215-.028-.322l1.152-.605a.66.66 0 0 1 .677.077l2.414 2.09c.17.15.135.208-.081.139z"
              />
              <path
                fill={`url(#${idPrefix}-F)`}
                d="M5.663 2.93c-.223.045-.262-.031-.085-.173L7.804.972A.7.7 0 0 1 8.496.9l1.687.84c.202.101.188.223-.035.268z"
              />
              <path
                fill={`url(#${idPrefix}-G)`}
                d="M11.65 1.555a.92.92 0 0 1-.733.007L9.598.906c-.202-.1-.184-.177.046-.167l2.861.129c.227.01.248.104.05.211z"
              />
              <path
                fill={`url(#${idPrefix}-H)`}
                d="M4.67 2.86c-.177.143-.382.188-.457.101-.074-.087.025-.243.227-.347l1.188-.622c.202-.104.22-.076.046.066z"
              />
              <path
                fill={`url(#${idPrefix}-I)`}
                d="M3.146 16.99c.089-.072.284 0 .44.167l.868.941c.153.167.128.191-.053.06l-1.085-.789c-.18-.132-.258-.302-.17-.378"
              />
              <path
                fill={`url(#${idPrefix}-J)`}
                d="M18.163 4.322c.089-.073.248.024.355.222l.634 1.163c.107.198.078.216-.067.045l-.82-.982c-.141-.17-.187-.375-.102-.448"
              />
              <path
                fill={`url(#${idPrefix}-K)`}
                d="M17.67 3.58c.185.131.26.301.174.378-.089.073-.284 0-.44-.167l-.868-.94c-.153-.167-.128-.192.053-.06z"
              />
              <path
                fill={`url(#${idPrefix}-L)`}
                d="M2.72 16.179c.146.173.192.375.104.447s-.248-.024-.355-.222l-.634-1.163c-.107-.198-.078-.215.067-.045z"
              />
            </g>
          </g>
        </g>
      </g>
      <defs>
        <linearGradient
          id={`${idPrefix}-e`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-f`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-g`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-h`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-i`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-j`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-k`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-l`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-m`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-n`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-o`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-p`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-q`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-r`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-s`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-t`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-u`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-v`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-w`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.452}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-x`}
          x1={10.495}
          x2={10.514}
          y1={0.739}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-y`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-z`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-A`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-B`}
          x1={10.495}
          x2={10.514}
          y1={0.739}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-C`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-D`}
          x1={10.495}
          x2={10.514}
          y1={0.739}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-E`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-F`}
          x1={10.495}
          x2={10.514}
          y1={0.739}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-G`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-H`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-I`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-J`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-K`}
          x1={10.495}
          x2={10.514}
          y1={0.738}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-L`}
          x1={10.495}
          x2={10.514}
          y1={0.739}
          y2={24.453}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DA88DE" />
          <stop offset={0.374} stopColor="#5E75E8" />
          <stop offset={1} stopColor="#80C6EB" />
        </linearGradient>
        <clipPath id={`${idPrefix}-a`}>
          <path fill="#fff" d="M.495.5h20v20h-20z" />
        </clipPath>
        <clipPath id={`${idPrefix}-b`}>
          <path fill="#fff" d="M.495.5h20v20h-20z" />
        </clipPath>
        <clipPath id={`${idPrefix}-c`}>
          <path fill="#fff" d="M.495.738h20v19.524h-20z" />
        </clipPath>
      </defs>
    </svg>
  )
}
