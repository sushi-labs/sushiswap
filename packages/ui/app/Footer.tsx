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

const config: Record<string, Record<string, { href: string; rel?: string; target?: string }>> = {
  Services: {
    Swap: { href: 'https://sushi.com/swap' },
    'Liquidity Providing': { href: 'https://app.sushi.com/pools', target: '_blank', rel: 'noopener noreferrer' },
    'Lending & Borrowing': { href: 'https://app.sushi.com/kashi', target: '_blank', rel: 'noopener noreferrer' },
    'Miso Launchpad': { href: 'https://app.sushi.com/miso', target: '_blank', rel: 'noopener noreferrer' },
    'Shoyu NFT': { href: 'https://shoyunft.com', target: '_blank', rel: 'noopener noreferrer' },
    'Furo Streaming': { href: 'https://sushi.com/furo' },
    Analytics: { href: 'https://analytics.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
  },
  Help: {
    'About Us': { href: 'https://docs.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
    'Discord Support': { href: 'https://discord.gg/NVPXN4e', target: '_blank', rel: 'noopener noreferrer' },
    'Twitter Support': { href: 'https://twitter.com/sushiswap', target: '_blank', rel: 'noopener noreferrer' },
    'Forum Support': { href: 'https://forum.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
  },
  Developers: {
    GitBook: { href: 'https://docs.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
    GitHub: { href: 'https://github.com/sushiswap', target: '_blank', rel: 'noopener noreferrer' },
    Development: { href: 'https://dev.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
    SushiGuard: { href: 'https://docs.openmev.org', target: '_blank', rel: 'noopener noreferrer' },
  },
  Governance: {
    'Forum & Proposals': { href: 'https://forum.sushi.com', target: '_blank', rel: 'noopener noreferrer' },
    Vote: { href: 'https://snapshot.org/#/sushigov.eth', target: '_blank', rel: 'noopener noreferrer' },
  },
  Protocol: {
    'Apply for Onsen': {
      href: 'https://docs.google.com/document/d/1VcdrqAn1sR8Wa0BSSU-jAl68CfoECR62LCzIyzUpZ_U',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    Vesting: { href: 'https://app.sushi.com/vesting', target: '_blank', rel: 'noopener noreferrer' },
  },
}

export function Footer(props: FooterProps): JSX.Element {
  return (
    <footer className="flex border-t border-slate-400/5 py-[72px]" {...props}>
      <Container maxWidth="5xl" className="grid grid-cols-1 md:grid-cols-[176px_auto] mx-auto px-4 gap-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-start gap-3 pt-2">
            <SushiWithTextIcon height={20} className="text-slate-50" />
          </div>
          <div className="text-sm sm:text-[0.625rem] leading-5 sm:leading-4 text-slate-400">
            Our community is building a comprehensive decentralized trading platform for the future of finance. Join us!
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/sushiswap" target="_blank" rel="noopener noreferrer">
              <GithubIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://twitter.com/sushiswap" target="_blank" rel="noopener noreferrer">
              <TwitterIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://instagram.com/instasushiswap" target="_blank" rel="noopener noreferrer">
              <InstagramIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://medium.com/sushiswap-org" target="_blank" rel="noopener noreferrer">
              <MediumIcon width={16} className="text-slate-300 hover:text-slate-50" />
            </a>
            <a href="https://discord.gg/NVPXN4e" target="_blank" rel="noopener noreferrer">
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
              {Object.entries(items).map(([item, { href, rel, target }]) => (
                <a
                  key={item}
                  href={href}
                  target={target}
                  rel={rel}
                  className="text-sm cursor-pointer sm:text-xs text-slate-400 hover:underline"
                >
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
