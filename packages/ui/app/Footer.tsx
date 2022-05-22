import { Container, DiscordIcon, GithubIcon, InstagramIcon, MediumIcon, SushiIcon, TwitterIcon, Typography } from '..'

const config: Record<string, Record<string, string>> = {
  Services: {
    Swap: 'https://app.sushi.com',
    'Liquidity Providing': 'https://app.sushi.com/pools',
    'Lending & Borrowing': 'https://app.sushi.com/kashi',
    'Miso Launchpad': 'https://app.sushi.com/miso',
    'Shoyu NFT': 'https://shoyunft.com',
    'Furo Streaming': 'https://furo.sushi.com',
    Analytics: 'https://analytics.sushi.com',
  },
  Help: {
    'About Us': 'https://docs.sushi.com',
    'Discord Support': 'https://discord.gg/NVPXN4e',
    'Twitter Support': 'https://twitter.com/sushiswap',
    'Forum Support': 'https://forum.sushi.com',
  },
  Developers: {
    GitBook: 'https://docs.sushi.com',
    GitHub: 'https://github.com/sushiswap',
    Development: 'https://dev.sushi.com',
    SushiGuard: 'https://docs.openmev.org',
  },
  Governance: {
    'Forum & Proposals': 'https://forum.sushi.com',
    Vote: 'https://snapshot.org/#/sushigov.eth',
  },
  Protocol: {
    'Apply for Onsen': 'https://docs.google.com/document/d/1VcdrqAn1sR8Wa0BSSU-jAl68CfoECR62LCzIyzUpZ_U',
    Vesting: 'https://app.sushi.com/vesting',
  },
}

export function Footer(): JSX.Element {
  return (
    <footer className="flex border-t border-slate-800 py-[72px]">
      <Container maxWidth="5xl" className="grid grid-cols-[176px_auto] mx-auto px-4 gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <SushiIcon width={32} height={32} />
            <Typography variant="lg" weight={900} className="text-slate-200 tracking-tight">
              SushiSwap
            </Typography>
          </div>
          <Typography variant="xxs" className="!leading-4 text-slate-400">
            Our community is building a comprehensive decentralized trading platform for the future of finance. Join us!
          </Typography>
          <div className="flex items-center gap-4">
            <a href="https://github.com/sushiswap" target="_blank" rel="noreferrer">
              <GithubIcon width={16} className="text-slate-300" />
            </a>
            <a href="https://twitter.com/sushiswap" target="_blank" rel="noreferrer">
              <TwitterIcon width={16} className="text-slate-300" />
            </a>
            <a href="https://instagram.com/instasushiswap" target="_blank" rel="noreferrer">
              <InstagramIcon width={16} className="text-slate-300" />
            </a>
            <a href="https://medium.com/sushiswap-org" target="_blank" rel="noreferrer">
              <MediumIcon width={16} className="text-slate-300" />
            </a>
            <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noreferrer">
              <DiscordIcon width={16} className="text-slate-300" />
            </a>
          </div>
        </div>
        <div className="px-10 grid grid-cols-5 gap-x-6 mt-[10px]">
          {Object.entries(config).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-[10px]">
              <Typography variant="xs" weight={700} className="text-slate-100">
                {title}
              </Typography>
              {Object.entries(items).map(([item, href]) => (
                <a key={item} href={href} className="text-xs text-slate-400 hover:underline cursor-pointer">
                  {item}
                </a>
              ))}
            </div>
          ))}
        </div>
      </Container>
      <div className="flex border-t border-slate-800"></div>
    </footer>
  )
}

export default Footer
