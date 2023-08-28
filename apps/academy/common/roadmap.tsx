import { LinkExternal } from '@sushiswap/ui'

export const roadmapSections = [
  {
    product: 'BentoBox',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          Our vault implementation, and the base of each of our products & frameworks that have been introduced and put
          into production. Everything is built on top of BentoBox and as more functionality is introduced they will be
          able to take advantage of Bento’s capabilities that include strategies for putting idle assets to use while
          earning extra yield for users, and internalizing actions such swaps within Bento that provide major gas-saving
          incentives.
        </p>
        <p>
          Strategies at the base are an important part of allowing users to earn more on their assets as they put them
          to work within our protocol, further development and focus will be on this side of Bento with more capable
          strategies and offering additional yield for many more tokens.
        </p>
        <p>
          Trident & Kashi have been built on BentoBox, thus they take advantage of these improvements that come with
          using Bento as our central vault to put idle assets to work within our products.
        </p>
        <p>
          For BentoBox to reach its full potential, much is in the works to support increased product development on top
          of Bento from within the team and outside collaborators. Majority of our developer outreach will be focused on
          supporting and promoting BentoBox to developers within our space. With included talks, hackathons, and much
          more planned we believe BentoBox has the potential to be a main infrastructure layer for DeFi akin to AWS and
          the web.
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Trident AMM Framework',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          Initial release of Trident came at the end of March 2022, and it’s a central part of our vision going forward.
          Trident was designed as a framework, and is built using a single interface called the IPool interface. This
          allows us to continue rapid development of unique and new pool types, which can be slotted into the base
          framework much easier than in the past or compared to other AMM protocols.
        </p>
        <p>
          Constant product or the well-known 50-50 split of assets is now in production, and has been going through the
          battle testing phase on Polygon. We will continue to monitor it during this phase, while the release of three
          new pool types are in the pipeline and will be released alongside constant product pools in the near future.
          The three new pool types will be in the form of a Stable or like-kind asset pool, a concentrated liquidity
          style pool, and the third being a multi-asset index style pool.
        </p>
        <p>
          As Trident is a product framework, we expect and look forward to seeing many more iterations & types of pools
          to come into play over time. Our routing engine Tines has been designed to keep in mind the flexibility of our
          framework, and to simplify the process of introducing new pool types that have direct support for swaps as
          soon as they are pushed into production.
        </p>
        <p>
          Plans are in place to further upgrade Tines, and improve on the initial design that is in production now. We
          will continue to work towards a routing engine that works efficiently within our framework, and provides the
          best price for all swaps on our protocol.
        </p>
        <p>
          More info on our initial launch and future plans can be found under this{' '}
          <LinkExternal
            href="https://medium.com/sushiswap-org/trident-pool-1-constant-product-pool-5ef0ea7468e7"
            className="underline"
          >
            medium post
          </LinkExternal>
          .
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Kashi Lending & Borrowing Framework',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          Our isolated lending protocol was introduced almost a year ago, and has been sufficiently battle-tested so
          far. Due to this, we will be continuing further work on introducing new types of Kashi pairs and further
          evolving from the initial pair that is in production now.
        </p>
        <p>
          Kashi’s biggest inhibitor over the last has been primarily due to lack of resources dedicated towards its
          development, and focus being shifted to other products like Trident. Now, we have plans to unlock its full
          potential and exciting things are being cooked up to continue to improve on its initial release.
        </p>
        <p>Further improvements include:</p>
        <ul className="list-disc ml-4">
          <li>
            An oracle framework to allow for easy onboarding of any oracle provider, and introducing lending and
            borrowing markets for many more tokens.
          </li>
          <li>
            Complete rebuild of the UI that has already been completed, and ensures continuity & similar experience to
            our other products.
          </li>
          <li>
            Completion of key features, such as TWAP support, which unlocks lending and borrowing against liquidity
            pairs and various other types of assets within the space.
          </li>
          <li>
            Integration with limit orders to provide margin leveraged orders or trading. Better tooling to monitor and
            inform users on market performance, and allow us to A/B test different styles of Kashi configurations.
          </li>
        </ul>

        <p>
          Alongside the introduction of these new features and base improvements to Kashi, we have plans and have work
          being done to improve the user experience and introduce easier ways for users to put their assets to work
          within Kashi.
        </p>
        <p>
          A main enhancement to this will be in the form of our Kashi Optimizer, that will provide optimized lending
          rates across multiple isolated markets in one place. Users will then be able to deploy a single asset in
          exchange for a koToken, and underneath the optimizer will put the tokens to work across multiple markets with
          the goal of earning user’s a higher and more optimized yield.
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Miso Launchpad Framework',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          Our solution to launching a new token or introducing price discovery for many kinds of assets on release.{' '}
        </p>

        <p>
          Lots of work over the last few months has gone into integrating Miso directly into our main Sushi app, and we
          now have a better system in place to scale up the completely permissionless framework. Continued work will be
          done in regards to introducing new forms of recipes, or scripts per se that have unified steps that are taken
          during an auction and on release of a new token. The auction creation process can then cater to any project’s
          pre and post-launch plans. Some of these enhancements include:
        </p>

        <ul className="list-disc ml-4">
          <li>Gnosis Safe or Minimal Multisig Deployment on launch.</li>
          <li>
            Liquidity Lockups or direct Liquidity Launching to spin up liquidity pairs the moment an auction ends.
          </li>
          <li>Vesting schedule put into place at the end of an auction.</li>
          <li>
            Direct incentive deployment, to establish well incentivized farms for new projects looking to build their
            liquidity on Sushi from day one.
          </li>
        </ul>
        <p>
          In the past Miso was gatekept, or required team involvement to help projects launch tokens and provide
          assistance during the process. Today, Miso is now completely permissionless and anyone has the ability to spin
          up new auctions at any time. Permissionless Miso has been deployed onto a number of major networks, and is
          available to use for any project regardless of the chain they decide to launch on.
        </p>
        <p>
          Decentralized curation or signaling of Miso Auctions is being explored, and we will continue to seek ways we
          can further improve the experience for users to ensure that they are participating in legitimate auctions.
          Read Less
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Shōyu',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          The Shōyu team expects to have an open beta available in 8-10 weeks so long as there are no unforeseen
          complications on the way.
        </p>

        <p>
          Shōyu 2.0 started development in January of 2022 and was built completely from the ground up. We’re
          approaching a stage now where we are starting to show what we’ve been building to the community. It’s
          extremely exciting and we can’t wait to share what we’ve been working on.
        </p>

        <p>Features to be excited about:</p>
        <ul className="list-disc ml-4">
          <li>
            Collection and Trait based offer system - This is great if you’ve been thinking of purchasing a Moonbird
            with a particular trait like ‘Diamond Eyes’ for a specified price.
          </li>
          <li>
            Add to basket & checkout system including floor sweeping tools - If you plan to purchase multiple NFTs in
            one transaction then this is for you and so are the gas savings that come with it.
          </li>
          <li>
            Make a purchase with any combination of tokens in your wallet - All listings are in ETH/WETH and we perform
            the swap under the hood at the time of sale.
          </li>
          <li>
            Best NFT indexer and search experience to date - With the help of StreamingFast technology we are building
            the best NFT indexer on the market. One of the major pain points with current NFT marketplaces is that their
            search engines are sub-optimal and finding what you want is often met with resistance. We’ve put in systems
            to make this a problem of the past.
          </li>
          <li>
            Social features - The social aspect of Shōyu is a completely opt-in system, if you do not wish to make a
            post about your collected or created artworks then you don’t have to. We do not have comments enabled on the
            NFT item page on the marketplace. On the other side of that discussion we would love for creators and
            collectors to build their communities through Shōyu. We are building a system very similar to Twitter where
            our social features do not interfere with the marketplace but instead bolster and promote it. If that’s not
            for you, that’s totally okay. For a quick example of what we can do with this; BAYC could make an
            announcement through Shōyu and only allow BAYC owners to comment on the post.
          </li>
          <li>
            Email and in-app notifications for purchases, offers, likes and more - When you make a purchase or sale on
            Shōyu, you can receive a notification via email and/or in-app.
          </li>
        </ul>
        <p>
          There are more innovative ideas we’re working on at Shōyu and you will hear more about them in the coming
          weeks. We hope to see you in the beta trying to break everything you can so we can make the changes needed to
          provide you all with the best product possible.
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Peripheral Systems',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          The glue to ensuring that Sushi is a self-functioning system is of the utmost importance to us. We have plans
          and work being done to improve on the lessons we’ve learned over the past year. We will introduce improvements
          that remove central points of failure.
        </p>

        <p>
          MasterChef for one has been our main incentivization tool, and has done wonders for establishing us as a real
          contender within the ecosystem. But with it, because of the ease and speed we needed initially to incentivize
          many different types of liquidity pairs we are inhibited to scale it properly as it should be across all
          chains. With this, we will be introducing a new permissionless staking and incentive system, so any project
          can ensure that their liquidity pools are properly incentivized to grow their liquidity requirements without
          needing to work directly with the Sushi team. This also improves on several of the problems that have been
          discovered through our various chef contracts, such as rewards running out. This introduces clear guard rails
          to ensure users are rewarded as displayed on the interface. We believe that Sushi emissions shouldn’t and
          won’t be heavily relied u[on in the future to introduce new tokens to our protocol. We’ve observed current
          farms at 2x to believe that this will be the case.
        </p>

        <p>
          Fee collection from our various protocols is another pain point that we’ve had to deal with in the past.
          Further work is being done to cut manual operations needed to ensure that xSushi holders are receiving the
          full benefits of activity that happens within our protocols. Improvements on the SushiMaker contract have
          already been put in place, and have improved the timeliness of fee delivery but are still not fully
          self-functioning. Thus, we are looking into and experimenting with a new style of fee collection in the form
          of SushiMaker Auctions. This is an automated way for fee collection to happen without the involvement of the
          team. Fees can then be accumulated and anyone can kick off an auction to sell the accrued fees mainly in the
          form of liquidity positions to the highest bidder of the auction. Automation can then easily be slotted in to
          ensure multichain bridging of fees, and provide a better experience for xSushi holders.
        </p>
        <p>
          The SushiBar or xSushi is another contract we will continue to think and iterate on in regards to improving
          its existence. For one, we think ve-models might not be the best way to go in regards to revamping this
          structure. Though a type of gauge system is very intriguing and offers a good way for projects and large
          holders to bribe their way into directing emissions towards their pairs. It requires further emissions & major
          discussions on the hard cap and total supply of Sushi. A proposal called Kanpai has been released on snapshot,
          and its primary goal is to move towards a way we can both ensure sustainability of the protocol while also
          ensuring value is constantly accruing to the sushi token and its holders. We don’t believe a complete scrap of
          xSushi is the answer to our problems, though we do see it as an opportunity to improve on and ensure that fees
          are properly directed towards sustainability and value accrual. With that much more discussion and community
          input/direction will be needed in the short future to decide the way forward for xSushi, veSushi, or something
          else.
        </p>
        <p>
          We are still experimenting with products that will unlock more for our users. For example, Furo is one of
          these products that will be deployed into production relatively soon and will unlock improved token streaming
          and vesting capabilities. Designed as a framework, with composability and additional feature extension in
          mind.
        </p>
        <p>
          We will introduce other additional products to supplement our suite, and are always open to outside
          collaboration from our community in regards to building fun and innovative features.
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },

  {
    product: 'Integrations',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          From the start, Sushi has always looked towards collaborating and extending our systems through composability
          with other innovative projects. We will continue down this path of working with many teams, and integrating
          with them to improve our products.
        </p>

        <p>
          Sushi Guard the OpenMev implementation for Sushi is one such integration that is live, and has been worked on
          extensively over the last couple of months with continued improvement in the pipeline. Sushi Guard will help
          us tackle the problems that exist in the form of MEV, while also taking advantage of MEV with the introduction
          of back-running and a rebate system to kickback fees and positive slippage to our users. A current proposal
          with more info on this is located here on the forum.
        </p>

        <p>
          Stargate is another such integration that we are very excited about, and we have many ideas being worked
          through. This will unlock tremendous potential from our multi-chain initiative we have executed on. Multichain
          will continue to be extended in the future. Easy wins, we will likely see in production in the near future
          include things like:
        </p>
        <ul className="list-disc ml-4">
          <li>
            BentoBox to BentoBox transfers across chains, with the ultimate goal of providing an easy way for users to
            deploy assets to the best yielding opportunities.
          </li>
          <li>
            Cross-chain swaps, will unlock the liquidity that we have built up across various chains with many
            improvements for the user that come with this experience.
          </li>
          <li>
            {"Many ideas will come from this integration, though we don't want to reveal all of our cards just yet."}
          </li>
        </ul>
        <p>
          In addition to these main integrations we have in the pipeline, we will continue to work closely with all of
          the teams that we have established connections with over the last year. Important things on the horizon
          include:
        </p>
        <ul className="list-disc ml-4">
          <li>
            Full migration of our data layer to The Graph’s Network, enabling true decentralization and up-time for our
            interface.
          </li>
          <li>
            Working with DAO tooling projects such as Utopia, supporting them with the integration of our products and
            also helping in any way we can to improve DAO operations and the various nuances that come with it.
          </li>
          <li>
            Continued use of ImmuneFi and its bounty programs to ensure our protocols and newly deployed features are
            continuously being poked and prodded by whitehats to help us discover and prevent future exploits.
          </li>
          <li>
            Continued use of Certora and their formal verification processes to ensure future releases are well tested
            and have all been formally verified.
          </li>
          <li>
            We will continue to be good stewards of our ecosystem while giving back and growing the ecosystem as a
            whole.
          </li>
        </ul>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
  {
    product: 'Tooling & Documentation',
    description: (
      <div className="space-y-4 text-slate-300 text-sm sm:text-xl">
        <p>
          Documentation has been an area we’ve highlighted to improve upon. Complete revamp of our docs page is
          underway, and better consolidation of information is needed to continue to promote the Open Source nature of
          our development. Ensuring devs will not have to jump through hoops while attempting to build on and extend our
          protocols is tremendously important to our ecosystem plans.
        </p>

        <p>
          Users will also be kept in mind as we work on our revamp. Expect informative guides & blogs to assist users as
          they discover and use Sushi’s products. We will seek to continue our support for users through the Samurai
          team and we are confident in their abilities to continue to improve on this experience.
        </p>

        <p>
          Tooling is another area we’d like to dedicate resources towards, including easy to use cli tools for
          developers to work with. Improving the development experience for Open Source developers and keeping things
          simple for advanced users to interact with our protocols is key.
        </p>
        <p>
          Improved analytics will continue to be thought through along the road ahead. We will work to ensure all users
          and stakeholders have the ability to source the information they need when making financial decisions. While
          also improving the transparency in regards to the operations of the protocol, and its journey towards a
          self-functioning and decentralized future.
        </p>
      </div>
    ),
    lastUpdated: '04/25/22',
  },
]
