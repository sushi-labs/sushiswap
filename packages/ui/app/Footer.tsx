import {
  Container,
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  MediumIcon,
  SushiWithTextIcon,
  TwitterIcon,
  Typography,
} from '..'

export type FooterProps = React.HTMLProps<HTMLDivElement>

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

export function Footer(props: FooterProps): JSX.Element {
  return (
    <footer className="flex border-t border-slate-400/5 py-[72px]" {...props}>
      <Container maxWidth="5xl" className="grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-start gap-3">
            <SushiWithTextIcon height={36} className="text-slate-50" />
          </div>
          <div className="text-sm sm:text-[0.625rem] leading-5 sm:leading-4 text-slate-400">
            Our community is building a comprehensive decentralized trading platform for the future of finance. Join us!
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/sushiswap" target="_blank" rel="noreferrer">
              <GithubIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://twitter.com/sushiswap" target="_blank" rel="noreferrer">
              <TwitterIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://instagram.com/instasushiswap" target="_blank" rel="noreferrer">
              <InstagramIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://medium.com/sushiswap-org" target="_blank" rel="noreferrer">
              <MediumIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noreferrer">
              <DiscordIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
          </div>
        </div>
        <div className="md:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-[40px] sm:mt-[10px]">
          {Object.entries(config).map(([title, items]) => (
            <div key={title} className="flex flex-col gap-[10px]">
              <Typography variant="xs" weight={500} className="text-sm sm:text-xs text-slate-100">
                {title}
              </Typography>
              {Object.entries(items).map(([item, href]) => (
                <a key={item} href={href} className="text-sm cursor-pointer sm:text-xs text-slate-400 hover:underline">
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
