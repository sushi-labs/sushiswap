import { Typography } from '@sushiswap/ui'
import React from 'react'

import { Layout } from '../components'

const TermsOfService = () => {
  return (
    <Layout maxWidth="7xl">
      <div className="flex flex-col justify-center gap-5 py-10">
        <Typography variant="hero" weight={700} className="text-center">
          Terms of Service
        </Typography>
        <Typography variant="xl" className="text-neutral-400 text-center">
          Legal Information & Notices
        </Typography>
      </div>
      <div className="prose mx-auto h-px bg-neutral-800 w-full my-3" />
      <div className="text-neutral-200 leading-6 prose prose-dark mx-auto">
        <p>
          Please read these Terms of Service (the “Terms”) and our{' '}
          <a href="/privacy-policy" className="text-neutral-200">
            Privacy Policy
          </a>{' '}
          (“Privacy Policy”) carefully because they govern your use of the website located at https://www.sushi.com/
          (the “Site”) and services accessible via the Site offered by Sushi Dojo Inc. (“Sushi”). To make these Terms
          easier to read, the Site and our services are collectively called the “Services.”
        </p>
        <ol>
          <li>
            <b>Agreement to Terms.</b> By using our Services, you agree to be bound by these Terms. If you don’t agree
            to be bound by these Terms, do not use the Services.
          </li>
          <li>
            <b>Privacy Policy.</b> Please review our Privacy Policy, which also governs your use of the Services, for
            information on how we collect, use and share your information.
          </li>
          <li>
            <b>Changes to these Terms or the Services.</b> We may update the Terms from time to time in our sole
            discretion. If we do, we’ll let you know by posting the updated Terms on the Site and/or may also send other
            communications. If you continue to use the Services after we have posted updated Terms it means that you
            accept and agree to the changes. If you don’t agree to be bound by the changes, you may not use the Services
            anymore. Because our Services are evolving over time we may change or discontinue all or any part of the
            Services, at any time and without notice, at our sole discretion.
          </li>
          <li>
            <b>Who May Use the Services?</b> You may use the Services only if you are 18 years or older and capable of
            forming a binding contract with Sushi, and not otherwise barred from using the Services under applicable
            law.
          </li>
          <li>
            <b>Our Intellectual Property.</b> We may make available through the Services content that is subject to
            intellectual property rights. We retain all rights to that content.
          </li>
          <li>
            <b>General Prohibitions and Sushi’s Enforcement Rights.</b> You agree not to do any of the following:
          </li>
          <ol type="a">
            <li>
              Use, display, mirror or frame the Services or any individual element within the Services, Sushi’s name,
              any Sushi trademark, logo or other proprietary information, or the layout and design of any page or form
              contained on a page, without Sushi’s express written consent;
            </li>
            <li>
              Access, tamper with, or use non-public areas of the Services, Sushi’s computer systems, or the technical
              delivery systems of Sushi’s providers;
            </li>
            <li>
              Attempt to probe, scan or test the vulnerability of any Sushi system or network or breach any security or
              authentication measures;
            </li>
            <li>
              Avoid, bypass, remove, deactivate, impair, descramble or otherwise circumvent any technological measure
              implemented by Sushi or any of Sushi’s providers or any other third party (including another user) to
              protect the Services;
            </li>
            <li>
              Attempt to access or search the Services or download content from the Services using any engine, software,
              tool, agent, device or mechanism (including spiders, robots, crawlers, data mining tools or the like)
              other than the software and/or search agents provided by Sushi or other generally available third-party
              web browsers;
            </li>
            <li>
              Send any unsolicited or unauthorized advertising, promotional materials, email, junk mail, spam, chain
              letters or other form of solicitation;
            </li>
            <li>
              Use any meta tags or other hidden text or metadata utilizing a Sushi trademark, logo URL or product name
              without Sushi’s express written consent;
            </li>
            <li>
              Use the Services, or any portion thereof, for any commercial purpose or for the benefit of any third party
              or in any manner not permitted by these Terms;
            </li>
            <li>
              Forge any TCP/IP packet header or any part of the header information in any email or newsgroup posting, or
              in any way use the Services to send altered, deceptive or false source-identifying information;
            </li>
            <li>
              Attempt to decipher, decompile, disassemble or reverse engineer any of the software used to provide the
              Services;
            </li>
            <li>
              Interfere with, or attempt to interfere with, the access of any user, host or network, including, without
              limitation, sending a virus, overloading, flooding, spamming, or mail-bombing the Services;
            </li>
            <li>
              Collect or store any personally identifiable information from the Services from other users of the
              Services without their express permission;
            </li>
            <li>Impersonate or misrepresent your affiliation with any person or entity;</li>
            <li>Violate any applicable law or regulation; or</li>
            <li>Encourage or enable any other individual to do any of the foregoing.</li>
          </ol>
        </ol>
        <p>
          Sushi is not obligated to monitor access to or use of the Services or to review or edit any content. However,
          we have the right to do so for the purpose of operating the Services, to ensure compliance with these Terms
          and to comply with applicable law or other legal requirements. We reserve the right, but are not obligated, to
          remove or disable access to any content at any time and without notice, including, but not limited to, if we,
          at our sole discretion, consider it objectionable or in violation of these Terms. We have the right to
          investigate violations of these Terms or conduct that affects the Services. We may also consult and cooperate
          with law enforcement authorities to prosecute users who violate the law.
        </p>
        <ol start={7}>
          <li>
            <b>Third Party Services and other Resources.</b> The Services may allow you to access third-party websites,
            services, or other resources (“<b>Third Party Services</b>”). We provide access to such Third Party Services
            only as a convenience and are not responsible for the Third Party Services or any other content, products or
            services on or available from those resources or links displayed on such websites. Your use of such Third
            Party Services is entirely at your own risk, and you acknowledge sole responsibility for and assume all risk
            arising from, your use of any Third Party Services and other third-party resources.
          </li>
          <li>
            <b>Termination.</b> We may suspend or terminate your access to and use of the Services, including suspending
            access to the Services, at our sole discretion, at any time and without notice to you. Upon any termination,
            discontinuation or cancellation of the Services, the following Sections will survive: 5, 6, 8, 9, 10, 11, 12
            and 13.
          </li>
          <li>
            <b>Warranty Disclaimers.</b> THE SERVICES ARE PROVIDED “AS IS,” WITHOUT WARRANTY OF ANY KIND. WITHOUT
            LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, QUIET ENJOYMENT AND NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF
            DEALING OR USAGE OF TRADE. We make no warranty that the Services will meet your requirements or be available
            on an uninterrupted, secure, or error-free basis. We make no warranty regarding the quality, accuracy,
            timeliness, truthfulness, completeness or reliability of any information or content on the Services.
          </li>
        </ol>
        <p>
          <b>
            Without limiting the foregoing, you assume all risks associated with using the Services, and digital assets
            and decentralized systems generally, including but not limited to, that: (a) digital assets are highly
            volatile; (b) using digital assets is inherently risky due to both features of such assets and the potential
            unauthorized acts of third parties; (c) you may not have ready access to assets; and (d) you may lose some
            or all of your tokens or other assets. You agree that you will have no recourse against anyone else for any
            losses due to the use of the Services. For example, these losses may arise from or relate to: (i) incorrect
            information; (ii) software or network failures; (iii) corrupted cryptocurrency wallet files; (iv)
            unauthorized access; (v) errors, mistakes, or inaccuracies; or (vi) third-party activities.
          </b>
        </p>
        <ol start={10}>
          <li>
            <b>Indemnity.</b> You will indemnify and hold Sushi and its officers, directors, employees and agents,
            harmless from and against any claims, disputes, demands, liabilities, damages, losses, and costs and
            expenses, including, without limitation, reasonable legal and accounting fees arising out of or in any way
            connected with (a) your access to or use of the Services, or (b) your violation of these Terms.
          </li>
          <li>
            <b>Limitation of Liability.</b>
          </li>
          <ol type="a">
            <li>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER Sushi NOR ITS SERVICE PROVIDERS INVOLVED IN CREATING,
              PRODUCING, OR DELIVERING THE SERVICES WILL BE LIABLE FOR ANY INCIDENTAL, SPECIAL, EXEMPLARY OR
              CONSEQUENTIAL DAMAGES, OR DAMAGES FOR LOST PROFITS, LOST REVENUES, LOST SAVINGS, LOST BUSINESS
              OPPORTUNITY, LOSS OF DATA OR GOODWILL, SERVICE INTERRUPTION, COMPUTER DAMAGE OR SYSTEM FAILURE OR THE COST
              OF SUBSTITUTE SERVICES OF ANY KIND ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR FROM THE USE OF OR
              INABILITY TO USE THE SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT
              LIABILITY OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT Sushi OR ITS SERVICE PROVIDERS HAVE BEEN INFORMED
              OF THE POSSIBILITY OF SUCH DAMAGE, EVEN IF A LIMITED REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF
              ITS ESSENTIAL PURPOSE.
            </li>
            <li>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL Sushi’S TOTAL LIABILITY ARISING OUT OF OR IN
              CONNECTION WITH THESE TERMS OR FROM THE USE OF OR INABILITY TO USE THE SERVICES EXCEED THE AMOUNTS YOU
              HAVE PAID OR ARE PAYABLE BY YOU TO Sushi FOR USE OF THE SERVICES OR ONE HUNDRED DOLLARS ($100), IF YOU
              HAVE NOT HAD ANY PAYMENT OBLIGATIONS TO Sushi, AS APPLICABLE.
            </li>
            <li>
              THE EXCLUSIONS AND LIMITATIONS OF DAMAGES SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE
              BARGAIN BETWEEN Sushi AND YOU.
            </li>
          </ol>
          <li>
            <b>Governing Law and Forum Choice.</b> These Terms and any action related thereto will be governed by the
            laws of Panama, without regard to its conflict of laws provisions. The parties expressly consent to personal
            and exclusive jurisdiction in the courts located in Panama, and you and Sushi each waive any objection to
            jurisdiction and venue in such courts.
          </li>
          <li>
            <b>General Terms.</b>
          </li>
          <ol type="a">
            <li>
              <u>Reservation of Rights.</u> Sushi and its licensors exclusively own all right, title and interest in and
              to the Services, including all associated intellectual property rights. You acknowledge that the Services
              are protected by copyright, trademark, and other laws of the United States and foreign countries. You
              agree not to remove, alter or obscure any copyright, trademark, service mark or other proprietary rights
              notices incorporated in or accompanying the Services.
            </li>
            <li>
              <u>Entire Agreement.</u> These Terms constitute the entire and exclusive understanding and agreement
              between Sushi and you regarding the Services, and these Terms supersede and replace all prior oral or
              written understandings or agreements between Sushi and you regarding the Services. If any provision of
              these Terms is held invalid or unenforceable by an arbitrator or a court of competent jurisdiction, that
              provision will be enforced to the maximum extent permissible and the other provisions of these Terms will
              remain in full force and effect. You may not assign or transfer these Terms, by operation of law or
              otherwise, without Sushi’s prior written consent. Any attempt by you to assign or transfer these Terms,
              without such consent, will be null and void. Sushi may freely assign or transfer these Terms without
              restriction. Subject to the foregoing, these Terms will bind and inure to the benefit of the parties,
              their successors and permitted assigns.
            </li>
            <li>
              <u>Notices.</u> Any notices or other communications provided by Sushi under these Terms will be given: (i)
              via email; or (ii) by posting to the Services. For notices made by email, the date of receipt will be
              deemed the date on which such notice is transmitted.
            </li>
            <li>
              <u>Waiver of Rights.</u> Sushi’s failure to enforce any right or provision of these Terms will not be
              considered a waiver of such right or provision. The waiver of any such right or provision will be
              effective only if in writing and signed by a duly authorized representative of Sushi. Except as expressly
              set forth in these Terms, the exercise by either party of any of its remedies under these Terms will be
              without prejudice to its other remedies under these Terms or otherwise.
            </li>
          </ol>
          <li>
            <b>Contact Information.</b> If you have any questions about these Terms or the Services, please contact
            Sushi at
            <a href="mailto:contact@sushi.com" className="text-neutral-200">
              contact@sushi.com
            </a>
          </li>
        </ol>
      </div>
    </Layout>
  )
}

export default TermsOfService
