import { Button, Typography } from '@sushiswap/ui'
import { Layout, MarketsSection } from 'components'
import { DEFAULT_MARKETS, SUPPORTED_CHAIN_IDS } from 'config'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import useSWR, { SWRConfig, unstable_serialize } from 'swr'

import { PairCard } from '../components/PairCard'
import { getPairs } from '../lib/api'
import { KashiPair } from '.graphclient'

export const getServerSideProps: GetServerSideProps = async ({ query, res }) => {
  // res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  const chainIds = (query.chianIds as string[]) || SUPPORTED_CHAIN_IDS

  const [lending, borrowing] = await Promise.all([
    Promise.all(
      DEFAULT_MARKETS.map((addressMap) =>
        Promise.all(
          chainIds
            .filter((chainId) => chainId in addressMap)
            .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
              previousValue[i] = getPairs({
                first: 1000,
                // orderBy: 'supplyAPR',
                // orderDirection: 'desc',
                where: { asset: addressMap[currentValue].toLowerCase() },
                chainIds: [currentValue],
              }).then((pairs) => {
                return pairs.sort((a, b) => {
                  const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
                  const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
                  if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
                  return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
                })
              })
              return previousValue
            }, [])
        ).then((pairs) =>
          pairs
            .flat()
            .sort((a, b) => {
              const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
              const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
              if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
              return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
            })
            .slice(0, 1)
        )
      )
    ).then((pairs) =>
      pairs.flat().sort((a, b) => {
        const _a = new KashiMediumRiskLendingPairV1(a as KashiPair)
        const _b = new KashiMediumRiskLendingPairV1(b as KashiPair)
        if (_b.supplyAPR.equalTo(_a.supplyAPR)) return 0
        return _b.supplyAPR.lessThan(_a.supplyAPR) ? -1 : 1
      })
    ),
    Promise.all(
      DEFAULT_MARKETS.map((addressMap) =>
        Promise.all(
          chainIds
            .filter((chainId) => chainId in addressMap)
            .reduce<ReturnType<typeof getPairs>[]>((previousValue, currentValue: string, i) => {
              previousValue[i] = getPairs({
                first: 1,
                orderBy: 'totalBorrowUSD',
                orderDirection: 'desc',
                where: { asset: addressMap[currentValue].toLowerCase() },
                chainIds: [currentValue],
              })
              return previousValue
            }, [])
        ).then((pairs) =>
          pairs
            .flat()
            .sort((a, b) => {
              console.log({ totalBorrowUSD: a.totalBorrowUSD })
              if (b.totalBorrowUSD === a.totalBorrowUSD) return 0
              return b.totalBorrowUSD < a.totalBorrowUSD ? -1 : 1
            })
            .slice(0, 1)
        )
      )
    ).then((pairs) =>
      pairs.flat().sort((a, b) => {
        if (b.totalBorrowUSD === a.totalBorrowUSD) return 0
        return b.totalBorrowUSD < a.totalBorrowUSD ? -1 : 1
      })
    ),
  ])
  return {
    props: {
      fallback: {
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'currentSupplyAPR',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: DEFAULT_MARKETS.length,
            },
          },
        })]: lending,
        [unstable_serialize({
          url: '/kashi/api/pairs',
          args: {
            sorting: [
              {
                id: 'totalBorrowUSD',
                desc: true,
              },
            ],
            pagination: {
              pageIndex: 0,
              pageSize: DEFAULT_MARKETS.length,
            },
          },
        })]: borrowing,
      },
    },
  }
}

const Index: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_Index />
    </SWRConfig>
  )
}

const _Index = () => {
  const { data } = useSWR<KashiPair[]>('/kashi/api/pairs', (url) => fetch(url).then((res) => res.json()))

  const pairs = useMemo(
    () => (Array.isArray(data) ? data.map((pair) => new KashiMediumRiskLendingPairV1(pair)) : []),
    [data]
  )

  return (
    <Layout>
      <div className="space-y-20">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <Typography variant="hero" weight={600}>
              Kashi Lending
            </Typography>
            <Typography weight={400} className="text-slate-300 leading-7">
              Lend, borrow or margin trade with low liquidiation risk, and earn staking rewards!
            </Typography>
            <div className="mt-4">
              <Button className="!px-10">My Position</Button>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-[462px] h-[294px]">
              <Image
                alt="kashi"
                layout="responsive"
                width="462px"
                height="294px"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAc4AAAEmCAMAAADcL4BtAAAC9FBMVEUAAAAjyvog1vp3TNsVzPz///+ARuEAxP8Aw/75vDIAwv8Axf4BxP8AxP8AxP////+CR+WASeWCR+X7viX///874fQAwv+BR+QAw/4i1fsAxP474Pc74PcAwv863/YAwv6ASeY73/Y74PY74PY73/aBR+Y83/eCR+X7vyM93/aCR+UAwf7///+CSOb///+CR+SBR+UAwf4Awf884Pf8vyUAnej7viWCR+X///874Pb///+BR+aCR+Q73/b8vyP///8AuP37vyP////8vyP7viQEq+j8vyQAldUAvf37vyM73/YAvf3///8Avf0Awv4Auv38vyQAuvoAwP7///+CR+X///8Avf01P1MPvOj8vyMBGiIkMkAFjsf8vyQAv/6b9+6F8O0EnNj///8CldEFQVX///8EmN0JJzf///8HhbX///////9y6+v4/P////8PIy0Awf4BrfO8/PEBouuu+u8Flc80P1L///8AY4INQ1v///8AExkmzOWU0PgLc5kCp+YCn9nd5vsKcpkQQVSY0vgBot0AqOYBpd4Dj8j7vyRc4uhP6+kCh7MBru044O8AquILJjG54PvV1vsBoeW8ufeBUecHW3oXWHQEhbmAWenDzfgHiLdD1+YDy/0DjcmAcOwFfaoJy/YAYoD+6K639vL///8/dI/7vyV77OyZ9O5X6+0Yu9tf6Ok84ugBEhgEquL+4p035fEOqNT8y00CMkLDxPmrpfSW8O8J1foIrNwpN0n8wi6Svd3N9vc1QVQo4/L91Gz+24IM3/kEm82z3vqThvD8wCe74vsVZoNz8+uUjfGu3Pr/78n7vySr2vokhKW7xveBR+Zif+osfJtN5ehMdYtjfuqX0fgvOU2jnfSCR+VifuunpvVigOr///8xPE+DSOVifur7vyT6//73/v3y/v3m/vrs//rq8f3J/vLe//fV/vX/9+L8yUVtg5kpoPAyRmDKsvWEqceBmu5yi+yshe9KWGuesPNcbYIrbaDIzNKhpq9/tT0SAAAA3nRSTlMABAcECgUIEw4FNhccISYOJh8MCQkNQhQwECtAU09MPRAjGB05GiktDxMzSTBTE0k+XVYzIdwaOSFGHENOLhQYuigpL1jfUMOQSVqHNm9jqUGAaTtZTpqA4ztVH741efTz21euaCXrmkOsU1vvYz8zc8v91Pud3kh9oUtD46ibtov9t1mHfJhu2GDvqmmka2EO9PXJw2Owl9F0+4vqoeiBxMNm9uxGm3Cw2tbVnH5jVtzPy6J42bHCremRhf7777u0zIRJ35exf0vFqHL65b4k98qzOY94Zsa6pqTXxEBDGkbfAABDLElEQVR42uydP0tbURjGA5KhU4f6IToUp1JKBqUqQiFDoAQp4nJpSriXxM3AhTsEs7iZL9AlhKyCm6ZFIZghRrrFKQFFyGCtWAj+Wfr+O/fcJLZdetvIPQ8lbdre6dfned/znnNuY0ZGRkaTpLjSdNxXzOgxSjhOTz/Vgm+G6CMUoSSSMzMzc6wZEDNFoobpoxGyZJRziUTiNSjzGpVIAFVkakz6WBRnmMwSOGbm51+I5ufnASsgJaCG52MQh6ywRJLJZPIdKglCpkiULGqATrziIIZJLAFkPp/NZqso+DkPVIloIjEzY3hOtuIxbn8IJrHMVguumwbZaRs+3UIBkSYJ6Jwx6IQLaDJMMOa7PLAEjpbltFolVMuxLBuYVrMa6PS04TmpYpoYswizkLaBpHdcLhf7XVC/WG50PGCaTheyeQYKBjU8J1MYtGLNZD7rpm2ndFwmkEH1y52SYwtQY9CJFfdAc68zUDPBmVbOa5wzwXGiHgKFyJ3PAE/jz8mTdLQJpJknmGVmJzFbLn/+HHAqAa2CQTOv50yHO4ESmlA1s65tlRTM83LDKzVzpGbJo/QVoBYaFAPX+HPSFNc0q2k71zkXlselnONYINvGT8fJlTpl/sP+cct2fZ7ThucESdFMAk2rWWaYjSawpKWJWwDhAhSoOjmv3meDNq109V3S+HPSJF3QPJVNr6hgIku3CoODPEyD4AOHCrh6cbwGG9QDnuhP0w9NkpgmJm0h7XhkvaKHMN0CzIBwVEuC2S0uR11yaJF5OoqnidtJERXOuQTVTcujygjWxLUIsKSNlAxpngbyMPhzbcdpNsjD7E9Yrxh7Toq4cGagpxWa58dgzXSBZ3m4zcni7TIACpFsO7lOX3hmgacpnxOjeBzboBdJpNmnCAVrugQTSNJ+9QwM/+hYAiBFoFkXeMpfttwst0MG5yQIzUltkGs3haYFNNGZiQTta7LkqIlMAQuKZ7Fpu3kAb+J2MqSitmC3yopmAQc+CTl1oKW2zzLzzJOiuZyzsXwae/5WT57AD/yIhStghF0tRu1xF9QhmjReB5jIcOwM0VxCuuAcPwHlM4ndrbHnAyKKz5SeoMJEKuaEqKXsbEDdLKi1JPIZpy+rGvJnA9uhEj0B9jSLlVGSzPK5FiANkadUzhfJatopUyV02Jt6MrC1sbv+pdf7sn6ysSJPCE/oh5pFiluxp8E5ZktkOTs7+0o0OwtEAehULAyJORGN5XVBnmO5+WSA5toJoPR1ssE8JZ9di8unBw+Z6jksxRJJvkS9wQ8ESjxj4UjMmQVzctSC0V74NLdOeiNaX/H9iQtVjFttT5O2Sr4vkeWbNwsiQMo8Q8Epa86MMmffw8KphwJr2play8xTumGnyfYsmOZWsxSaxBJRrr4nra4i0FeQt2HhRC4Qm2LOes5K55N+U/Oh96B2mafELdmzwc2twalylmGiL1dX36dSqbegVAqIIs/w4pawoMtKfWhR2ZyvE+zNZU3wsl6/vBrhSXFbRXtSc1vFB03agoZgvieUSyQgijxfAc/QcErWdqgE0sBOMnPNxze4rl/fXAeALqsWKglP5tDXx1YBmyHT26I1sWgqmIhycbG2t3NwsI3af8/2DIdmPJi1HYfmO9zRrKwrmHf160Gvd3UJTBXPNYrbBPnawVlC2TFpq2nOAk2CiSw3dw4qF11f+wsvQ3Gn4OQOtQVZ2y8JE8K5K+Tuu91L/tVtHbmS1vlR/pdQOodnW+kqdsRRxylBq2HuHRyddYPaDgunlE5qUD3J2jxOd8icUjSv7mC2QL+8+v79u19CN3ROc9p61BJHvXhOaZoQs4uLO9vMUutij3GGWjrtDtY/1QjF0Zycs937m67Y8yPgvL2u1ylxTwL/FJyGKZ4j3kRrgjN9mGdHlYP9/R3Q5kKYtRP6GVpuIBHPkcBEIl8kaLsD+OiDJW+RJji0fs3VEx7mAYTtkLVpmhR1nEGamwdSMY+29/dqm4uLS0vY2TLN0HDqTqgki8dpv629hKp414Oyeg9RC7oCpj8Y5zJbm4un7oWijBO6IKIJZROtWWFfVvYBJbFEmKsL/wJnqwgWbAYMtsw4v2LSXsLHDZkTP64Rp6StLFVw17vYkjlfZHE+iT0L0Nxna1YO2ZcyRNBToZBw0iwgjUOEz8FO6ESmB5S0d+BRcOfHq4/wcck4v0jhpZVnEVtbPDMUZZxT2psQtGcUszsAM8jyzUuhGTLOLuLErTFpTtcFZ68IKKkbuoWoxbwFnKQtWKrQ3FZa21K6GmmckrRviOY25ew2w0zJtJZgEs2wzBnEWc7JWiMexIkob8ijt1eYtz2FcwWf5jG8jzPKC09sg3CF4tO82MeYpYIpKGW7MySa2p22xjnqzh6uOwfUDWHU9oZwykrFuFNFLdBMLS0eEM2dTYa5oFESyyDNUN1pPRC2PUKJ3dDgE0Qt45SwnVbu/GxwgjkhaonmzhmNC5gmbnEKyvCPCgVnfMWc7QLO4VYIPggld0O3+HW8FUKcfcCZjC5OrJxYOFNvF3cufJqyHzarSYZ0qkTjfHihsqtwghDlgBYrV/h7ZqHygChqqXDWKippyZrS+oR/JFMOZRJOKzhGQCJrAZyD+2L/8r5YvAOajFP2PNXDFNXycDRxsjkXVqVwngVpqloZvrTByjzky6rmdIuGfDc8oA1qcC1DPr0bQ0O+Bls7sjjZnBK125i0RNNfYz6vHbbbp6ft9uHmy1hI0rsix0gERvCEU6et3uPUxxIGskOmR/D4cAf6qOjuqIA5pQ/CqK3UhKZvzdThaUCHqVgo0s2p3iDLDG2QDfgQgoYpe58baE5ytt4gi+7pEqCpzNkFQdS+Ta2iNxnmSwVTAx1yaDjb1+dq+1p2yFhyqkTOmAja9eChsVJfzfiiejRT2lo0p0Qt0ZxlmrX26ZjatVgY0lsq/oZnhi+bbPHSU06VMMxBT7TCOc1Z2/E3VKI6FHryTJmTulqKWqDJ+yZ7pw9qLxaCBAoXz3JO9TNqj0wDhZy9GTpqK1ulac7ajuVGd/caGyFecx5g5ZSo5RMkQjN8noJTjfnweGWTzn7xVU05ZqsTd+ygbSKDDzoeHhWK9MFMvxGqYVurzMk0a0GC374Fv4WQt34FtOj0s9oj0wdtxyU0fXPWKWujfKsBcOqsPYK2VpkTuqB2kObZRZBnO4R+yC+BXpfsyW+ukKuaG+t/vtTg9f07R5FddT6TrMWdlIPNoDkPh2h2u0M8D2Naf/vKEZXAhq6exHNldxTmyRrTxOngOzRnw5gTSidNhDaPMGvRnAtiztQIzRGef3v9iWjkQiDb0xMwjFMD1TCDL5XCC4HdyF8IlNL5dmkP7VejRggXKTExp6bJPMO357yyZ7Glr5DFWCsbuyd0XXd3GdcnQjMRvK7L08GI9rV+6Vza4b4WB0KvuHKO0KxURng+/+s0uamhW0fnGLd0+VpwjiuuL9O/U5fp+57twmX6qJqTcaplyjb3tYxzc4Tm6SnzDK+51a+6wLPTIM/NS9r+Gqa8jNHJ0RPHKqAji3P2ld8J7avSOdwIfbsgmsATcYaatvqdXw0qn/nx15AIS7Iyv4iGXlxCXW25ZUf7rq6Ps6I7IS6d7dMAzwqvOytIUwFtx0gh2BN4uq0iZmdLcI6SVP8nB70mSmjKrveL//4emqmp2P+Q4NQD2z1adWqcGiX+LMasnH0LE+dT4VngReQQnHhMUCLLuURi/CVu6f/6Ercp1k/2zic0rioK49HxT2tVMvFPbVGazaBUh4wiFkxA/ENA0SIyGxe6EAQRWroTBBcD2QR3Q95isplFkGwDZbLJJhWjEKs0GyWhBCERZuHGRfae75zvznlvXuITyX3JiF/VjO2NSn9+555777n3PCCqVOQPcC0VreO8rTjfdpypQMuvylOwB55jxy9/afr6Z7Jj1597I/UCpsJkRzJtY8WX/+WJqN9P+snMgHEiJaVarlXPPleAc69EnOSJ9AYv1s79PDd4393f+VKWeAGVD6B+MvQAKlKnMlcpZAmSk5OT51OSvy0LabE7fwo8l2hTzpuxgi0FYtZ1TMT+RUaHqaz+mtBmtxx/nviTz/X5cI4vTwOW52u1WhUalx+iWg1I4dICoJHmzu+zcyd5lpgK0Z6E9qk2AKQ5GYgVprH8UmH+YC1WWuJNp1kSTrIUmOJKoBwXPRskn4kUHi0AGjmzjb1QKeYpIVX+ZLM42wK05irOkjBP6ml/NyZYKsjLoisqfBKkSpRA4xPNrzs/xLpT6xAO3UbYc5zzY3EU8h3tnuuPK3qS9IWhvCaNrNiV49drOm+WTLMiMpjVqrAEyAY0DeEDoIJoABodJzf5uCt0K70r9Fx+k480qUhFfZVs0/LHHSeXMPJaONrifEeWYs05vGFcIk0qA1NYCscp0YwKnwD1iniUQMvwZ3bPdtb3bHNb8KQZM9ZSBpS6P2VOibSffSVdq1qZplXX5OV/dJUrtWlVZazCObM6LsYUlgqyXk86XVEnqdfrgDrdUItWhedkCQH3iBOVQw/I9uIdkOWBujKnLT8GkuyX89U161j1Qskt5UhTYUqMnZoSkt3NhcVWny0pW72FjY4gFaB0qEbcmDy9VCh/3pk7vibN+OYkUf6g7mfNwZyz7Esjq08AE9YEzfIWnJUMzWllebe9n2tg2L4rRBUoeUbGWclUI6ykom2uuGRvqLikTHm13lzoE/jzV9pgxduxlrtCCTQ1zM4kq4tkmSPa2xCLGtBaLbY//cBzuFaoEq/0699fMMNtXpGQFIUGKy/YZkOZNNWcpAmYLW9IudjrLSz0eu3WgG97Q0MuDRoZp02eHm29WKigMLNc8TlN4gRNuQOagVnu7gHMKZEWNDfbhm1/UWbLZlDS3V4I4fdOR4A2rijPibgLlqFoy32+wPO00OSVhy8/IU6lyTD76mslwyTOWvXZy43ppGfM2qvdZlPTWapebza7Cy0z7WoiBiXPiZg8H9Noy9x2b+0tmz3JM8qlhn//Yt91x6kPpKadWe4+rc6cYs7pDeW1f2czEZZYmARNTSnRzt12MKjwvCw8o+VDdCdr+dJ3VBBui68cnR0rT4YTz3qJ5q7pQ/GaztKZpFmSBrF225oYCkxj2bgS1MCuggG1MRt1+jMqT7/e+T3sedPDLXgecSHwbErlUNWLC46TTzDq2qRUZzpOJELb+7DmQsL1pe7qqbjnJ0BnBOgdDbibpfD0y9crmtwi3CpPS2/h0PlwXXf5OW/KQSnRuOLtzzccp5ZUoyYoKstid7bUdtz90d0CUVUkX2znDw5tNlf7xnNGeWL9GRMntuHFnmt7fvuaPM8e1cgB4pMmZfC8f8idvI90MjA9se3t7i4mGmSVJQ45VXb0OY7tv4YC3STPKVmvSDoU3Z6vD95GWB96G+Fsjia7cnirnBJ4Zt2pM+cJ1UZz2ambCNOrq3U5OvGTEy1BEKEuQQbYFiB4drWUrQueMjC2Pflyye2hl0sIlOPYLgcs0SpHxNYq8XnSncxs5yTWnjBOTJ62+86DTfGckGTZFzQRNujFoIFnuzMzDZ6ymxCBZ+5dobU/yJPvCtF94KUoYUzvsMJeOdF55nGe8I1cRlvwlIA6bsZkGQmUPtmuYutIeSLe9nT6FPSR7clsaH1vwBMGFaAgKrLZ0oz5ujbLeT/dWyW+Pfk2ieE88dfeB6djKsJUkC4DqgYVnpw/V8sLt/k3+cx+glT1Suhi9aE15Zh/K/YT1C57auYb4vSuHCcksx6AYsIMzsyNMuqB5yqmz45mtzGzoYq/mEmewy9mUmDJBivSX2Xlj6VlGfPRm2X4837e/TScJ/42SYilkLI0r1U7O1u/ibZ2kirHOc9msohwq9ktZs84NPlkJnja68S7UPY9WwosCXP+JtKm0niyVcr1LwznF7yLNHZi8jJpsLQ42xCUrq0kGBQ8LzembPrc79KeMaMtwq2lQ5g/1aDp16YBVUgKS8IMjRxWMs8QxRKPr1EpZDi1MihSQS2PpyGhNCwfwhFMf8SZAaYDrdo4+PNZ5Xk3a89yeN7kW/AAqkTBlL3lZhWmNHKgJCpzEymyPa1U6PqPu6Ifr78b60ouST4QJOabgPSD/ozCww9RCnHHMbo6fvqi4bbTcntOTpBmDA13ajCg62vaqYECSvQkWzGYe8yC02cw0cRCvnd/1LZUWugVAyfLoG1WPJ+6o4DPNlGSqLNwmnl1uCXIcOv2HK9Gi7acPslT8tvZ5WC/P5bQR0WYqubnl2+ikRUbOVjWtGbVueAZFafYEzx/7v/+M2jGaFeuLJmxQtWsaiK/p1BAM+tP2rOO2bOV2NozYjLk/sR6BQZVoGyNs3JrHbq1suQ/KZjXVhTrsp+pxexzbletX3jhnafl8orddohA0+8nHCpA9XVJMU3yRCWK2bMnv2Ob0aMtcXoPMplBCTQnwhSt3d5lwRjtGRNnuG8k8ptIxxxnYUxhyQsKeclPe1W786wGdgcHeZ5V5Rlmz81BtK2dj4eTQIc7BC7t7eb1x4r0yxEJT02a9tYtu42IkzztYicuIrEK89hpcttcDytz8msK5DlGhZz2T5nXc0C3MGIweyYtjbaa2+Ynz2gG5fJybX2FcyVR3l65ucyZFERtU3BtVhefcXHyLpJKqjB5OHbMgbYmxgRKrQ7Ja3qaNbPYpRvs6zRoTSsa+nOYZ4P2tL2EHnPbiJNnnqcB5bLkpsyaolu31oFSOyeHJYttOtyejx1t/SoSpHdXjpsmt1fD/YR6XnZPwYBaDXTanGK79oEYNAd0y2ZPRlvs9G1z8oyL008zh3tfmx1nIV2EckcBW31LOn3O2lol8s4Q7yI9fuwlJSHQioH0uDnZ2F44XKvdGZxxpWsKqgy0+xZnJXcdsuck/g0T3ErYkN+uBSnTjJELFXemZ2t6SkiGbT/8IoAuazq0Ljhju1PFW0jHTNOOo3lBIdnoCZIj1d4UGOZPi7YJcdKUB8Q5lNyGybMj/+xFW3lGxkmejLg8PRFqylRBekcy/UUFqunQ0kexcZLpsaOkN40mCge6i7sF6jXDIZfi3HGcqt22MG2nIu5OmDxxkJ0gKHMjoQScHnFJVE+qVfJh0JFMD8tsgl1HtOU5WeT/vgqI8mMkmqjSKuRpcx9PRbaGcErMbaPAbwB0K5MLya+1uG0bHadHXCcKptTL3pGMLewRjteXVmZDp46xkRPPsIxmc2Gf9xNWD9eC0t7GFYVwBv2b4+RHsOynFi3DOPtJqTjdooaUUpIs3wNuViaob1mUMHI4K0M07dZXN2mK6hnh3olIi2ZbzXDINeY4W75eaeOrAD04BOfiCeA8qxb1EkxgVHlLMtaAiXUFptIcTZzhfoKkKUaztZEAJW/Eu1AwC56IpBupM2hStPB6gG0CUuzTsFmcd8rG6aoYOBdRKvFQB6ZiRV9lbLREb6ZptrsKE8WzGekKBjxXdamh9jScFMKroOZ6JR1/c3PnCeFkPaYrE40JVAXzjjLN6QxNu21yOSssSWFQXTl6bspUiOEVBA8cZzYVugycLU+FJFafIvn0ahPq2VGLtUORljTFmWCpTz1RvKOg0BMccvUGQCq2UCHAPzWtdZzDC5Wpemahcrr+9+fsqixHlmY20nZgzQZvKIhqesypX4Wo8ezLuKZvuw6fjg0yoDZxJulthK5kSr1TiZMpkaEcOZjBm4TkNLEni2NNlz2dWGNQ1qVGR4kozskczv6BmZM4q8Sp322hGlc9a6cMp0+tBnO0eJLmkDcl0IZngLRIz+UFlj2ktl4hwsnTI+6+cDzAX9upWGs4Z5p301vwpw/nyIoVk3ma4+N+Q8EF+txFR2q76tGWB2QuPVbxXYQG/l2WCU3xgOx/nK5j3nVP0QQiXtgTmPnv4FoD099ik6citOeQ+mGPz83pO/AtdfZpS2xHWmq2WjVNs1u3613izUNf/xnYM2nZ3b5p5rZeXOLyooRquvarubF7WjOhkRaTWpxxBG9maI7l5dlpz6ItI+YDPCM7XEm+9GvjPxJr7zlC/2RQBHMyqfVIazS9Cujvom07ocdw6vl3hZkixHUzpxZmdmbU1yONM0XmXtU9ReLAKEjtpoFu07g3r9CbR71rKTgZbRcln9k0e/JYpfN3ZZmcORnWF0Ih3+jiFBQDPvdR97pIeEjpcQ70WJ8eaUwNR1pWdOXkMZO57Z1muGyi35FsHRZpGQjCfi0SoX7Ia0d26jQUCuhMSk+cOUNiOZ3JyqAeI9AQaxs5mp4F5eTlskkL9gRPvxlf3TniyhEfCONeBROh0Y21hKksLzwInTt3Tr9euHDmUHGcC+OOAvovZlrHGWhOMdL+/ZPQXG/Qni0N0Czq0wuBOxmYDd+sYKjdUHPW5ZtGN9YSJlgqyIepc4RKci4S95E28MwTYlEDWsDS9E9w/tJXmlOkWfT+oYfNpI1JsJnlKQ5Ndra2hKRc153kd5Cmhtq2n8WMaF6bhglAjzzyyKPQIyIyzYkcMYQjMRAWHeJJcD4lZ5Ks4lXneF1TVJTOFr5OSjp02szmfgi3gWfxZfoFu0w/uub0MCt+E0CC5+LFp6CLF50p2bkI8qKOvahDZdwwUNI0kpiJfZYt5Emcz263egneBSqiSXEeDGvPfpc8/ZYD5dYceupi02fOUcPpMMWZAgwoHxpIkYrILi2SzA4lUMFF9zlMnWwvDGbjQVAu2EXwd4HGPdIW8qTZOu3BeRp5mkMrfnebj5vwIZoNe4hmZM15zxjjrFpTYAqfS5eeNF26RExBT6WlKC9lBj9FoG7QbIJ1TgWkljYV4STPcZxR591VvMCZUTx3lCfdfT59CCMD/ZmoQHMRoXY001qPs4QJls8//4zp+eeNqNMDQLqRKDmagxUoDApYTvOJM8rS0yYFSg8XnI75u0BOs5hnOFTb3CfPGcy9AAqiVOYRN9JMP+I2YrF2kAJdGMAUPM+89NJLL4rkizG65PTSIsr0aPGoAAXPBwcB1+I4Z2XVI+pgIC+2J29ZK4QMzeLX+Gw23N4fVKNMNyxkV/2FRWEJmOknFvWQdARDLTaBGGfPgaa470ngefHq1asfqK6+KIjAiD4EPVqRnwWljOVgGf3MkzSoTaAqoQmYyLAoAapZ8BPKs/DavEgPqp1mMU/PVVfBs7+JWrEpNjSCBKRIWAaYyd39QJPV8yOFU2DSOm5Nw/PeezdufPzxt19//fW3CpQyeFfhROpFGXxDx3388Y0b7xl+AWoB13h6jhXyJuHtU+xf7J1baJtlGMdTKyqewIuJ1Xk+Mb1S6YWosJvSsjHLelGDFpPSMSkEbNNUKoa2Ku1KunZi1altdZUiPTpW1HXCLFSE1ZuJq4J4QpqDSW4EB976fw7f+35J2mbRxrSav6c6l87ll//zPu/zPe/zEs68g57sYKCCrtzQ/IaHTUc/oYCrI211PrGe+JV50zj1ojR1nO3OMifTtCkQwXyQnHkAJA8e3L+8EkzE4pODDWDHfiR6DW2DK4PLbXCiqAEwV5KJWGpyaXn/QSA9QECFJ8dbCDRtjiWyKROH27w3wonoywIfxihPBFE26DumNXeD4eEIypbmjjJn7qrpwDy4f3/d+EwwtkZH8FODsJzqybbBUCIaTU0vkxUheHh5JSE/b3qxsQ5E2xqeVJ66A+VQbtdliBdYNnB+nLqfUBVW7zU80Zj3upwSBFBYFB51j/anuxp+lNn/n7yJ7gUuPe1Qmm5rInISzLq68VMhhkScgsuIoWzEA22Daf7R2PTyQdX+pdTPomh6RoAeYJ7Ih4Snfl4oY5aFWeKx5Vl4wb5wno+/g0NIpJffyLh4A77EmvnVJ/ofv7cXqeyopFYzTmscjrMNBwhm4/iSj2Cq4oPPGif69AKZ1FJd3X4I5Gdi9ua40KlxABWeV98EWlQwMDTll6CFdvghAOV4a+y55YKrzcl73oR86VyL8/ob3+Oskuqd9z/9BMYUa8oTm/t3nDedZdP1VnOcFZj+OGBanEtYEyE4cTztONE/3iga9zNOdXLCtzQuPB/UcHsl1YDxgRGaT7atpGPRxOQqeFICTPlvsXBq35iWCBBwCagq+vLr734Cvct3UirM912XVu0smu5lU1dNteb4YiCtFlREqaX9+xFVyYqLaScCJxfr6xvxR319IJH5swOL4NnwEIVbDqagiV9DPjCgyT87Glw262vVVUXCqTzhT1MlAFDGl6uXBaYsmzssC4I3lab6xlpzcSbJMK1ivnoEVkTVusbGxaDzHxMze+tZe8NM3yqanBnf3wZ73ghaVP4R/wvN5eSafNMV/gk3UbQtHk7laQ2KpRIXPv6Wy/KrNxXm/TuQpnoT1hSasCZSIBCzi6YNn8lwzxCxhOr3GiuuhSb2strbIykNt3YJXVo+8JCuntfqL/Ig238lpi+fbHuI7ZmNs5g8H9A9yTtfvoGbAX9jvfz6J59+CZYOTKK5s0p7kgQpTQ60sOazYs10NsyULzzSM8Qs4cT2cOpnVeKUg7NmLBh3GVQ2N8/q6gme1yGc4yNDv8hycE0tHHr2IfoJWDyLidOOIlKgdhjRm2/iruQ35a5ksHTfrbuTad4otpF8NpZJJZbyjXWMjPRgjSSBXU3IARf1TSjOjmpvIGlMrUvrcoPihORXwR5o/1LCMfA08b6xyDhVatB7c68ytzeZqzN3WqDFumlp0v7kVnqfc62pMGuqqzuAk8TsOiIm8UmpPYGzujrsS8Xcr04MarS9HjTFnPhV6qajzouXDjYgGfqXcJJBFShbFEihxyAzwM/C3EnW9OgGRWnSskmBFtZc9IvBLMwQYBLNEU56FJ3XMI/61Z7MExHX/frEShvjpAffak5EgMWk89rQUC94FxlnLlBnzKac0obseE2EWYK5w2h6TBakSdCTEmhPac6qisaDEcAEzY6RvXvB0iyUdpuZPjUh8rLCPhfO+IzFac05kzB5ccu/itPe2GCG4N4vcobfcpfCTrMmZHJapvmQE2hTa5npbMArMNvbCeOEkTdCONVigYDf7/OFQsFkMp2Kx9yblfEDipNLtWLOcQf4WnpWcBY/s7VAM0dUu2ZTA+UOZUk4laZmm6BpAq21pi/swJw4NTMDasDG3IJJF/c11s+5iqZm+vsEJ4RYK+Y01d2Yr6f/oMGJqpDnX1Gl8WjG8HigFJY7kKaHqwfIaS1NzWjtqpmO1EiYbd97KhiLKrW8st5OB3qA80HGKeZ8COZsNNXd+Fht/8EGxVn1b+HUOq7eq6JikjuVJcTmpL2DrpugGYy6YcRDYYGJRfMUEp+ClQiEa1s6+7BRUZxIhOhzY2Ntcran/1neyaDIR09UPP+mKlkCUbVl35r+xG+Hr/z4V6Sh1lnP8CgsmYEs7td8FtuTRR9AF6xUuLa2pffIwzcyTpsILaadWOtfaOmnMiCqusiECGdJtLXvOWF0HbxzehSL/HsTc8p7zDSzdpvBM9XOXrNxiQAUjnOWzHns1uxYeyphY23LwQOCUxPbHa9K7SXeRaqiv12ONihlWkRdVWXNeTCHJoo9hw9Xd7SDJup6yF0KVyy0UNsJc9pYq3mtP2piba07E9rxOCsqmSR6T6uq9uy5S7Vnzx5gldbw4kVeXTnFnON2g2KKA4cPd7TvJZh1jUuGdSF50FhPS+86ee1icM3Ja5vdmdAOx0kRll0pJO+++07R3RBBBVI2qacoAk6YUwNgnaFpFIsAZ089YEL1vsQlAIxGY7FYAorH46l0CHlQ/4En5ek0+jCvdsK6sXpirHZbLJ1bIzYmWArJ+6AnWPQVQWWiZNHirKJVV6IeJMnmMtPMxVk9ojiHJoJx3qdESTGlBm6JqKWZCoZC2JT6/YFAIBIJj4BVH1hl1xCwTTE1BF06r77pup2+dIoz9xDMOwnkI488co/qkUcAlYky0CI5FEunxlqlmYuzubkHNPcDZ8+sP5mGkslk0FADtEjQ8gx5a2pqqlXNI5TVHuBnmVzg06WTtinO0hlqpqXzvxBrAVOcCV+CJZG8xSVmykQ55hblN1rl5LVtg0wzF2cz1EMNCMBZOzI764VqWNVGY/a1sYD98Q7QhDkb2JyCM3fpDAzI0old53XX7OBYi5yVYYoxHyGUjz766G1G+BdC+gg8KkCLUS/hTIgeWS+H1lzr35rB2cw8F+BPwlk70txcnasav11VExHDc2Sktqcf5uSV83rGaZbOuFk6B7B07vxtitBkZz6BEHsLk9y9e/fwPGsYXxJTJnofA+UDHFuPk9/jJwfjrhqrL2G81ixa6GkEzp6RkZGOXJqHD58JxexGc6ymQ4Tiw5AkrQ7O3Apf+swAwjFw7vBtCgKtWvMJ8iWhnJ87PRlM8/saTwcnV+bmCemjACoGLcLKQu4UnAlDMx0Jp8xGBSgH6C8AHRpinFkCTEg6vjS5GWsX7SWabYrzZrt0AmfALp3AaZbOnRpr2ZoCk5xJLKfMJ9woPrkCogQUaygH3K3maWpCxp2x9Fi1N+2g8Z1pFqAD+GuE1W7VgRX0sCiSWrM8Z+RRNooPdYxTtyna7oCl0xRso4H3BjoZJwq2O3XprLA0Bea+QZ+yzCU6t4+BwqBFiLdOFeHYcjAmNJNj1dXe5JpjHuBkgSe5tKamo6a9BiTxd0hgnqG/+eOWZ1x5Ek402dqSkCnYJs3S+R7c2bCzl07Q3EU0EWcF5llDLzg5PX369PT05FnDd3JOecKfqClsMc5reUU71jeTRnvPGtOsrgk6aNJeB2cNgPI/jc6cOXNYfoCZups4Y/6JCcGpZxrAE6KlM7OIEA8PvN3URzVA2XXuRJoe9iasKTRXJ53y5unB+eF9jmgljTlAmSfWzy1+HIgygrR8HevrnAmmUqkQ0eyo8UXN291seLYjrT3D8lqFw17vGYjSoYSrOhg8NZEZba8mmrJ02vr7GjKht99GSVcKtjs01nKk5UB72+5h7R0+OzW/bx+lsyp8CaSnxbfx0/seRYILe27x6nmVdr6f7OtsXQiPhWc51Wn3R00w7BCYIAZ0Y5GA38fdI+kUiWoKwZDPH4iEvWfCGqI14PoA1G1PCLHW1oQ0EwLO1iOcCRWwdFawtgf8SuS0QhPWnJ8U/w0Og6VsNiHdgoLo8KD+hGHYU1ZPzxbK6a89eWS0tbWpqba2lnMd0wIUDbQTz5rZcMQfTOMw57qNCKj7xeLJkIRoW+/zn5rgI2RkT/Akc2rLgz/qZM7vDbx94kTfSWRCWrDNz9FqO1CtYJp3C825uDgTMMGSdplGhFSAytZlTqPt1rqzCjxpe39yVHn29KBFbyxhUlvkr7PhQCiO0kJBUocujiPcwp48IYObst2dCLEI42w9eaNmQpfI8jLVNuCJNKjKoTkV5x5wduajVDBAVU/F1VvZjw77mOcqkqGtXjzRKiSnRr44Cp6dLS1DQ0P19fa0wlpyYiLsT6mZCgcaCwaWlp89gOT2RohPptE+JbRmakKE88To7ZeAc6NprCXFiYWzag/ntKBJMS09pzCBEuUfR/dp5Y+LRWzQ6eLgvFJ5Hjsy2tvZ219Xh7NE2KmYmp2fd5SFy9aYBpcbYE+eUoMm+2fd+5TwwEDTiVdeaT2ZH6d79puRIC0dTiyclNRampOrsq9klvSQU4UvpZbL6+g8UqLT9219anuZM0YEPE8eO3Kkjw8b7W23bUGxvw3TLqJoggdP0OSTRvttn1B8ljKhV155pftqSWzzeNPMflM5w988pZGGWqRBt6jlJmnV5DKePtysqpIGE34ECpNKcf6W3VNT99zJqVDF1uJkntdIb+ZJWdoa69tx+GQLlRrE6nkrmVNxppz/wDi7wXNUSnx5z0btktlvKh7nh5YNT4lUUXG5Lpy754mmj2nCmgRTu0kgaTYRovIYVB+sVG0xTjOCS49dStFmaASL5xYqttIAe0JyPK3RPE9JEs6m7u633uo+uvk+xY4Lk4msZhQrWbRUOCsqJNQiDRqeNN7kAh6RkjYSbs10Wk7EopA899zqp2TyHvGbxDxlmz/U065H/XK3JNo9YoR/iUbzNFJHpw9YnO4qQnKh6e23T7R2vwWe54Az79kohmlndeqwsKs8JZE71J6mpWNeaTIoYWlFRFEL3MPLKNwrNfgtxmnHV5q+hLb9jT3rRdu1aCKeSnHdwOeHAn6Sj8oKKCrEExuvsrGNcAaB8wRwdhHPC/lx2uFvOl1XB6x6SiMyJ4da3nDGBoWmBFGGmfteY7EAUYhgbnkJ3jWPlHmyPSnaeoNZMw4S6OPyR8bCXiroWVGFt6bG6x2L+EPpuBC1VjbjMTbAGVpoasI+pbur68UXjx+/cEVlfpqAaefr3kRAwdNTGl2GlVOyWgq10w5N++Trhu+++eFX6IdvvrvBAzkxl7SLaG5lk6bmi3Y4AvJb6RYYGunQhhGFGU/6x7zUZpCBkmBa1YQjoVTMRROOja5xNQFnVJAKGZwzLpwtwNna1XXoRQC9kAdn5oBdOzD3Gk9JJCsnmXMQv5ng8L7bHhVvqul++uZXl775zlndQBR/SM8tISgKULxbak+Kth01gZgFkw6EazaRJRpxHdONBsb8wRTaM30LncBJG5VcnC0trdh3dncdOvQceJ7bbI3PHP6WMS/XUxIBJ1ZOmJPzIITaR2+hujp5k670UJhWP9zg5HQVIGlb4is3ve7g705IoJ7bm65WnO01gajFGfIHNlZkzIumBJXXF18zJyJqyLGBsQU6cqQ45YFKNs5Xug69eui558Dzis1wcvrtjH6UaZzMswQ4tSCEtJZWTspqOdQip1VvfmcxWn1nzzygWb6SzZlR6uK/wbvZdwtVFgwUWyiJtrR41rdzYcgC3UwJX7i9A1KeJomKh01zJp5ocpGPcQ7ZVIhwchnh0KFXnyae37620QaPzEk0eVzY8sr09NQydrMy/thTClXCnEiEdOWcgzl54dzFyer7v66r99fzEWW81DefI11iCy5k6humiyfh3IsqfH7ZuSXtkBC1SVQ0UEM49cgRBBCZOJOzjBNCtH0aPJ87/uGFTcyp0wIbBpNR7JiSg8rzek8pVOEkQvNx2nLCnBRqpTAAmvl56hEIJsmFwBzJ6RbkTIUfbaFo68LpL6TsHue5JUwUXbdxE6PR0yfmPCZPVBycpoww0dPSiaoQtinA+dJLn8GgH64TcGkp4A5v9aZEjrXJZZ2W6ymBgFN2KbznPK150B6E2qxIe/FiZrzN7ZoHSC7TZ0tPtxBRmbxeIM5rDc6JYCG12lgANM1coaAZehBu5+bMvif5+bU8IAPOCVPkmxjqB04uIxx6Gjw/Wt+gurLrOI62lZgz4KZBhm16SiDKa02sjc/zyqmh9oYMQ777Z8a/3uD6DrbRWmt/bsnjNakfcV2icJzXK87GiXRBVTw/Okkg5olxJta0PdScyX3wkBYRh8w3jxPOzlHm+SHzfOk5XkHPr7N0SpmDPhDTUad42MbhtlQ4XbFW0lrFmZHT/vnzu39kbFgyuzn33C3tnNAt2dLDLSBqSkh/D2c94mEBSkRA0/AcsxNmuJnvgHTamka+/r1OmpU4JTi7jr/14lsfPk08n4dBEXEVqP2Na7/+w1S1cnBGp7VP0FMCydKJcu0cxVpOhJDW0jv+U0ao/e3nd7/OsOdPmkmZbk55bAZRn7w9BcFiqCBacN+84rxdcSYKoBlNhgmn8uww9ftYhJuFYE7t5OPF82B/T0hxxmbqwXN0tKvrOHad8CeAPv/Sx2TQD7+9UJkTa2XxrTNdur793IhUGpxODWGF8lqNtbnm/BrX6mSG229MqGWagCkPtXNlTkKgT8yUDgvFiWhWVz9jcK7lUTSaSEfaCWej8vSmzZLKrXwyXxFyTnn3+EyvEHD2jsKexBNBVgyKlEiInq90x1o158FGF05usi+ROzOXTom12SvnxZ8J57sZ2dAdas5dVUwTMPetTp1eX1Orw+6++UvniW9Pb1k2zlg6mUdBTF4knI3KU7asSqsRnXw6j08PkOG7DwVizsZzsbG/t5fs+cHHLxJB4WmAwqPn6emS7Ilvl8x4PGRw1j1bMpwmEzqLZi+KtYTz8uy0li+9yrLnd+bhmtDcN4VvsaHOTs/ZvvmruBr893GuBcPefKqpJpyQgzNocXIjn07LvN6UhE0oT0001vUTTvCkshAWTQWKkMtE4dFvL1w4j/qeZt04Zpr82eA8yAfUPCWQqfClKRPSpZNwfpORBxFO6I/saFsh7ZygOezLtw30waEScG11Pz9ODWiZOJPemktQ+17X4jnhwqmxFqOJIYm2bbpT0cWzTuyJMt+rn0mIfRU8AfT5p0FUkUKjo52dnS0LCwvNdm32D9HB7VLhtIntNHadJhP6wZ0H0aD5P79+NyMb+kFi9VXcxyA08wEdhEEtz0ssQer6BP/YYJvw+S9BgZkJ5Ukz++AegxNd07fK4HBuYAFOMpgFTqtrbx9wEk8Y1BJ9HsJGFCLbvvUWakfoHAXOMXtecTvg/Nni3EVdS+4t58+/vQ5n/gGg7nAr5tSa0mmOqKen1tfKZNzwvIV4yvpZEE4Nh+rPS1IseGovw4TCaft2I9bqLMxrbLzs7/HHHPPzZSt9o0eBEzwFH2W5iLGvvvo86dVDn1Ga1N3d2tLU1ISjTwE7gr50OO22U2pCt6yD8w+CCZykPy9m44Q5KdRyk+bwMJ9m2Z2pfaTV6ZjhWUC8ZZzXyRMy4EwV2q8XnNirGovbt5tST461PNRfF8/+HtfWdBz27Os76vB86WmEXEGKIGvU3f0KdOLE228PNIfWTJmCcBaQChUfZ4Ub50VEWQene/F0F3ynqGOMafKuBJvPR/XvEBNF3zzz3Kc8L23/6aSPNxJOW7gpvNBXE4mZCfHAKUsn37lhnqcOzZo7O3xizyNHj37wAfOEPsKiqUK6K0LdiHAi3IbTtqebpmSUAGdOsN0A58U/vlac7E2LsxLbHHm4No13bo5pglaWUEZgonPKc7f1Z96CvD4h0/SxsJqtHQcPeX12KPiQmTFDOGF+J9r6bCGQ7Pmsw1MqffDoRx+TS1WME9EW4bZ2wR6gocmpDSXHmZEKedyp0MXX/7z4J3AC5h9fu1KhrIJven4f0aRqgVv3yLyM29bjKf7M/4TsesWJnf7fxNm+jntu5gurTPcKcJqAHBV7th1RngBKeulp1kcfffQxq6urm3DCnLMm1iYCMmqzNDVbWvzsRkVxZhWFLkZ/u3gRq+bFP7922fMbVyPDviDyIPYmlwoyJNNsCOi6PPPjNLlQf08gUfCkU6HpDURd7nEyIbTbVdlo298zC/dbe4LnAeZpgCpN6BDRxDqqNBfsg9hUWGJ5iUrwjr+C1CckFfgqU0aw+05UhMih7jKCLfjulg8DYZLOeSt9aPZELs98pyFsYVTfb0pWKBcqsG5L8uoLrXt06UTzJ769ibauK3UW5ea5I8eOGqDEVP7x8SGH5itZ5oyGeobU/J4SyF3kizlFPnp2fcevLr2Oe0K/zqoK3eCpMJ8FXnlNQ+eeLOFBqB4DXnf9zNfSrXVuTlaC0cwm280kddt2omkP7a6pe3TuwS7tFST3AyeSIZNDLTYyz4ZjDBRC5xBJaXYd50gr5ozE7GMcWjofLhlOp8f2tC3B36Ul+MxCAooIF91FIV065ZwSXjyliRS1HUDaLKQNJzpyYX2eGwPVp1CaC6E1M6NxOpbKV7cNd3QA50QElFQxH9xjb2CgEwnifnz//pYef8L2MtQbnicVqOPSLpalGbZXfdCUav20eP59Acl6D8guz35A9gfhBE2rn8xrAWkaL141z0oByOoyGdfIA1HAs4B8SHG6U9sRr/s2uYQ/nKdsW82T/31gZMw5ZnDyxZzgqe4XeyajJmVaEp64ihdAQdQg7fqAaI5CKPC19PTM2gwtHrE3AnhKIUKS+/i6IvcJWc7zMZvXDqP4nh42eVRFDhI+PgqetIC6eeocm7w4r9fcs7Y5EncvjWnfWJjHJ+ZKO+HRNa1NmVodHKFg6OCkOIJ+H7Hnk7BnbSBuSxBL441yFS+AgiiQWhHM3t7OfoypmvDH7DANmPMgmbNUOA2TECLR6m6z86zIai55WfcoduXUvBaEuKUTLxVzrr8CmskL5E+tDynPjXFKpy3hRBGe3NOso0js6pkK0qmGMLzoFrxJIzB8ST1vb1OjESexvZ5xXmbsyasnkppYLs82AAVREZbSI1BfX29vP2jWLwYSLu/X6riwm0rUZ3uZtn7x+rfC0fY+zjgr87V+6Ss11k5xnKY0atO5KLe4eWq7/YY8KzwW562C87A3GcsdPpyI86EjiI4b8YGjVJzu48g+oxvpGBmqQ2IrszARbGklkL0K/E/2lHMTGm9PLaIYT0CJaAMzPSIs++jy1zpcSogLXlzeX2gx5izFoQZbp9s9H6O9o3oMITNPYyZ2hLrp5G1KfFjarTdAU1kh8ZbxG5557GmONdiN/kjz4bDhaZT/FhylGajp6DEFeMEp9tTkto/DreWZmsF+hYAy0bYDKtylDpo44Z95wUssOOsyZ4lwmmjLHrNt0wC6cdt0hT63ZjortE3ZMNaqmOddmeun2HPDsUScSCHzzMR5eCxJfihcUdCsHulpVJya2epVhLr37G2pXeDMyd58rkBBFEhJzFJgZlz0G02HZYw1V/dLdIIMb7PWXQd/VntKcssF1e9+2OBQA9EkV2siFJvTnHhXxWZJTdb6OcfNDxJtNzanZCrc/DVEOA+HKbspWLE0zZDPwHlNFXgCJ9uTsyGy52wwkT23hogCqVGdwMy46DeaiqC1vpf6PeXCbE8JpNGW7LlvUu0Jm5kDZLlHjr65Qb3Gj8ZgztMmEZItzkYy+ZD159xm0ZZpijnNEc8e5nnGXzhPNKTQccF2bhQyDiKcak8Jt72dxDOWcbFDaGaJiAKpqhEsxxdP6UEmS7NW73+Qb+0piTTaGnty4fa+DQ8E/mScRpUB0ByOExcTozfCiR+3/rQ8Dc7NzHmzHsAmnNWE0xsqHKePT/R2mDY+jrZoKyTZqz6OINy+5w2q6+zdkn4gBVPR4uLSjD8Zy8iZ00SzEzTxQeHvXIrZCGo0LaT7NjyuS+d1f/jh/e/u4LRG85onCAu/yGfMeVn+KY46YHWVeJ69RbaeFZuZU2MtpovU1+PAyRlvIF0YTc1TxwC0pqO+TqOtFm0Zp73Crrdp4L33sB3KTopRMeRBfwEaAJi1/+GhnkxTPyf0jUuEs9IkNSglZB6mz+1YV2tKMyZXYafIZMM2qdkUp3Tl6ixr4nkWNcUNg601p8Ta/Y1oFJkIB1JRGwjjCd2PbDCVL2Hv7KQzgmdq6E4AjrZqIuBknnLB5LHOphNvg2ezb92hYmvZqbO94w405eIk/Zjgg10SqT05uV3huWzK04y6qMgmUsU1WFtTxxbSrLeXMpdTBxPNT06uSmP8ZRu5k11jrlJorJ84lTG8LRbA9AO6ZzUu00pYOsWELsBJYnJCcM11YDviBc+FoYNoU5eEhZNbzW5vPjnaiuaCt6H33oukY5ecZKX8sw5NMj1/Sko2JsoOopFs6CyNLrEt65dXIMfVxc+BaZ6QzKcp1Cp+DZr555ObwUT2mMOG5tQtoV78mJUDJcZ4JdUZqKGgKERTTAI8AYMmTruxxELhMwMDtQstvQ/dKMkQ7MmHjM9/8e2H3dQs0nriBBEdQP4czQdSF9axhdqmDJpkzpINcXOPiUo7g4UeNWOiZACC1tJ5TBTucVCaZ2Vzg5/sNmd+f+pcIqJJ5twMJ5uTenmwZU8pTPu06zD0XraaWfgPh6GxeGZcDIRpClQTFrojJ3mZO3/+wrlv0ch1/EWo+xXbzRXBEpkfZjKwUJtJE5Yv6e0OtvkZCafhyQbl93uPDHGrkiFuOpFaaSI4S3XnEmlyOalK5hLZy3Uq18fJuxRJhJYHzSbPKBGC/ZqbXSAHjByyh7PTmmgysoC5QUStu/tD0XGg5Gba7regbuU5MBtIYozNZrM3AXOWYOLDoeum7GZBs4TuNCMWdShfigdmrjdiEa6yvSJprb3e4hSSQCW/nEFTdi7RRjhdNz8uT5swa1OboJeADdRCTU1wHP4mf4CFA7e52WuipkmJZjER8y0S/AiQoo9f/bYbP0C9l9Sfx3ORZzHGJqFEc1mmQhHAZGviZL7QlOV4+wxAdRooxaBEFEhV7saf4am4pemq7eSXuX2QbU+/9w1waqzFw4626VgOzLT/jNqxyaUTEGi+TSLEtQPNNZGkGtTewtGPE2LwpLL8+KOnn3/+Ww63n318HOIGPQa6EA5g1BSQrmVmzBhQFQgvMEwKtMf4/Pz2oKnZLdcFmCfk0/HEPJ/YTCd22vIQaH0/59CsKOA6SRrXKKvyhhVbu7vXG1WsooAJawo1WgpbXYI7Cap8DSTNzWEfj4qyis+09B49+sW5c+fQ0f7MM88LTIBFDxCA8sNpFIjQcgmNhCl/xkg4EWbGBX2BsVlmyTCxCsuNZlo3vGw7DA8346YRRKH4CgOVs7aqW8zw8CkZML4Kmma8f4FT2lQVG9F041xJZMOchSuBrRUTgIidBUr+5HWRmz+oXwBAOsaCGqzNtJnW1tGjR4XnuW8V5mcfsw598MHRo8eO9DFQECWks5Q+89WDY2EmaWGyNUGTrLkdvClesKP99fzQpADV2f56spph6tk/cyas8KmZlfCoqtJTAE6FGW4GTKYJaFgGXyGBJf+Tshnp5SGPgQnj8Kfda2B8lnMhkwk9RzC1gfbQq+fOffHFgycZaCeAAmmOmpglwzz5oM75km1Pyb0JVWZdvAHz8RmiVdfFG/iCWK5OC8z41L6Mm448W6fcYJtac8Mc4feTxlpCIHf8LbeOd6Gfh4XGAfYYAx3jlMjilJ/8ol0/VU+D5gWamWCAwqMiwUhqIZYK88ZtR9Ns8M21ODAoKzg9Z67FAcq56bMxnR86v7uYNDUV0vuOekMxG2Y1ziFagqUI+JDAcFaqHXf4MQqZJwmJAl0IpBNmXuZCd/fxtwSlslRhEAJO4uJUtgLFy4GUmLYAInFUlMQS+azAtIF2W9C0G3wqEdD6ODdpSilnz05OQ5OTpvAV861yokSn44VmMXDucopCx/qWkhh0iT07wdRsshdrH7M8RHrVrUMQFkCEzC9oSBsDJWuFQ1oiTPhau/mViK0gSFKYOML5zPnz18rcRCGKDwQhteoFSrAUYypMseb2oSnbT3ulHFKi6Q0Gv6ThTKfOUByakCnZyvVVs75kOhiY5WCna9Yx7U/Pxqn/ipB5QYg8fOyIZjULqPSgtJsILrwiOA85JxXwB0Qwn3lG50cDKFkURAkpbCrCV4SSWJIxHZjbypq2vM4FVQU6PzWZzp1yMDUsMN0l162X+4EK3XfUhCPrzFJgIszBe+fOET5lQiifdr7EOekL58/LTeUoEjppatMsLkZK+haQBomtgZGlMEHztdfQn6BAhaggBVQIHEHyQTO4FjA5zm4va+Zcx6pAdw+vTuFmwHQcopsCp1Yp2RWYdu5TMXHCnnQ/TqsKLGEQHTN604UL5869ZCBmcKGYeY0GTRNxOadZQBJFNBWnAn3JgfnaFTq53A4Fp+Fg0I0k+gIkdUw4OxOHI7abNTOfeACoVgyAVG9LHqZti1xjJTDNkKBKTxHEO5Uq4Xn7SeWpyaRJQM6fP8/TCiA6rvcS/SFcAAb3mQgRGAxAOSdqZdG2tEvCtPK3MCsraVPsvoBBkFqBpKA0lzJsQ2eK7COwO9e9ytwO8CqiNXNHc38BniwsW5kJyHmAe16RMhSIYKrJ9L4kA3RUgHaP0rIr0VlfpjCZpgLdxUQFKaCqCCSjFJbbGKYxKAHVh5JAaqQlPwOzqAUQxml4fnGU5LB0tgYwIBg8Q0gBVVFaLvxc2gDFFTu4BIvFBT7o+ZfwB8l5kfkoua8vEqZGQtJeZ1TyG+QuoURuLjSSUi1LLsJhlgqzmDTtRQiyfpJk1dIERMPcFa+RgINBgopwUSJqUGffoQdN8K0ukOwHwMJ0AyWijBRM3apy7hrb9jChCgGqRGWwKeRchANjMswi1yYZJ9NQHHbV0q2BWqOSxBQVpfWYOlyBcpr6BYnmt50n6SfAvsrKfQSOdJWRGYle+qsdC3grdYC0HKGGZHQ0s9z1L9SyKpzrjjQjEW2YgFR6iOp6N74pULmICJ8HfCZMSvoa6YoclG6kAjVL2+LW1QIkvwftQXDuwIH4cbMO6i+qbLQ0F7YRSFm2LjkBqYDsZwJI7UVh+l3oeoL8/ycKVuXZORyzgHKGZ3R58VHmmkt3gaoqTibzw1SZnMZ8KFwfiW3waPLflb6lNsLwh7n4ys1H7MJVYDapQLMv2dzuO4xiqshuzH99FeS6k0X0dz4ViDRXXbVLjPl/hVlCKdBc/a1vsk424ynjzKciM/3n32Kn5aVlbRJ2y7Ysq6yyyiqrrLLK2kl66vPPP/OU9R/RZ79AT3nK2ib65Z/q919+/9xT1jbRP6aJv8o4/yt6ioCWF8//jD77/PPy0llWWWWVVVZZZZVVVln/IR16Zjt9m7L+6Q78hdfy12zy0/zlhTLP0uspKl1vAc5nXijzLL2UZn6cZZ47QIZmXpxlnttfhmZ+nGWe216WZn6cZZ7bXUzzUnGWeW5zMc1Lxlnmub31Vzt3bMNACARRlC5p4HIyN0ADrucC6iDbVjwnObzAKyHkG/2fI4KXriaheXHimWj3EdtXM8GJZ6LdR2xtRhwlw4nnnsZ1+DRqplNvXq2kOPHc05BmZBv1XXKceO6phpo1U29F5Tjx/KGHHLGJE0+fxImnT+LE0ydx4umTOPH0SZx4+iROPH0SJ54+iRNPn8SJp0/ixNMnceLpkzjx9EmcePokTjx9EieePokTT5/EiadP4sTTphpxrvDsrGH+QWvmKOUZszfWMNeXP/1csV94CPQu1jC3NmLVHGWfN6KsYeZ78Bwla5jqYZe8W77/AKk3nFhIX6LFAAAAAElFTkSuQmCC"
              />
            </div>
          </div>
        </div>
        <section className="space-y-8">
          <Typography variant="h3" weight={600} className="text-slate-50 font-semibold">
            Top Lending Pairs
          </Typography>
          <div className="grid grid-cols-4 gap-6">
            {pairs.length > 0
              ? pairs
                  .sort((a, b) => Number(b.supplyAPR.toFixed()) - Number(a.supplyAPR.toFixed()))
                  .slice(0, 8)
                  .map((el) => <PairCard key={el.id} pair={el} variant="Lend" />)
              : Array.from(Array(8)).map((el, idx) => <PairCard key={idx} loading variant="Lend" />)}
          </div>
        </section>
        <MarketsSection />
        <section className="space-y-8">
          <Typography variant="h3" weight={600} className="text-slate-50 font-semibold">
            Lowest Borrowing Fee on Stablecoin
          </Typography>
          <div className="grid grid-cols-4 gap-6">
            {pairs.length > 0
              ? pairs
                  .filter((el) => el.asset.symbol && ['USDC', 'USDT', 'DAI', 'TUSD'].includes(el.asset.symbol))
                  .sort((a, b) => Number(a.borrowAPR.toFixed()) - Number(b.borrowAPR.toFixed()))
                  .slice(0, 8)
                  .map((el) => <PairCard key={el.id} pair={el} variant="Borrow" />)
              : Array.from(Array(8)).map((el, idx) => <PairCard key={idx} loading variant="Borrow" />)}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Index
