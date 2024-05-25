/* eslint-disable */
/* prettier-ignore */
import type { TadaDocumentNode, $tada } from 'gql.tada';

declare module 'gql.tada' {
 interface setupCache {
    "\n  query Bar($hourCnt: Int = 24, $dayCnt: Int = 7, $weekCnt: Int = 1000) {\n    hourSnapshots(first: $hourCnt, orderBy: date, orderDirection: desc) {\n      id\n      date\n      xSushiSupply\n      apr1m\n      apr3m\n      apr6m\n      apr12m\n    }\n    daySnapshots(first: $dayCnt, orderBy: date, orderDirection: desc) {\n      id\n      date\n      xSushiSupply\n      apr1m\n      apr3m\n      apr6m\n      apr12m\n    }\n    weekSnapshots(first: $weekCnt, orderBy: date, orderDirection: desc) {\n      id\n      date\n      xSushiSupply\n      apr1m\n      apr3m\n      apr6m\n      apr12m\n    }\n  }\n":
      TadaDocumentNode<{ weekSnapshots: unknown; daySnapshots: unknown; hourSnapshots: unknown; }, { weekCnt?: number; dayCnt?: number; hourCnt?: number; }, void>;
    "\n  query Bar($block: Block_height) {\n    xsushi(id: \"xSushi\", block: $block) {\n      id\n      sushiXsushiRatio\n      xSushiSushiRatio\n      sushiSupply\n      xSushiSupply\n      apr1m\n      apr3m\n      apr6m\n      apr12m\n    }\n  }\n":
      TadaDocumentNode<{ xsushi: unknown; }, { block?: { number_gte?: number; number?: number; hash?: `0x${string}`; }; }, void>;
  }
}
