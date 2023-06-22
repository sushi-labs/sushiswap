
import { beforeAll, describe, expect, test } from "vitest";
import { AddressMapper } from "../src/index.js";
import { ChainId } from "@sushiswap/chain";
import {  
    MANA_ADDRESS,
    MKR_ADDRESS,
    YFI_ADDRESS,
    ENJ_ADDRESS,
    CRV_ADDRESS,
    GALA_ADDRESS,
    MATIC_ADDRESS,
    GNO_ADDRESS,
    ARB_ADDRESS,
    KP3R_ADDRESS,
    LDO_ADDRESS,
    APE_ADDRESS,
    PRIMATE_ADDRESS,
    rETH2_ADDRESS,
    sETH2_ADDRESS,
    SWISE_ADDRESS,
    FEI_ADDRESS,
    TRIBE_ADDRESS,
    renBTC_ADDRESS,
    NFTX_ADDRESS,
    OHM_ADDRESS,
    SNX_ADDRESS,
    FTM_ADDRESS,
    WBTC_ADDRESS,
    UNI_ADDRESS,
    BUSD_ADDRESS,
    MAI_ADDRESS,
    TUSD_ADDRESS,
    ANKR_ADDRESS,
    AAVE_ADDRESS,
    COMP_ADDRESS,
    JPY_ADDRESS,
    LUSD_ADDRESS,
    WETH9_ADDRESS,
    WNATIVE_ADDRESS,
    SUSHI_ADDRESS,
    XSUSHI_ADDRESS,
    USDC_ADDRESS,
    USDT_ADDRESS,
    DAI_ADDRESS,
    MIM_ADDRESS,
    FRAX_ADDRESS,
    FXS_ADDRESS,
    BCT_ADDRESS,
    KLIMA_ADDRESS,
    QUICK_ADDRESS,
    OP_ADDRESS,
    LINK_ADDRESS,
    AGEUR_ADDRESS} from "@sushiswap/currency";

describe("Sushi addresses", () => {
    const addressLists = [
        MANA_ADDRESS,
        MKR_ADDRESS,
        YFI_ADDRESS,
        ENJ_ADDRESS,
        CRV_ADDRESS,
        GALA_ADDRESS,
        MATIC_ADDRESS,
        GNO_ADDRESS,
        ARB_ADDRESS,
        KP3R_ADDRESS,
        LDO_ADDRESS,
        APE_ADDRESS,
        PRIMATE_ADDRESS,
        rETH2_ADDRESS,
        sETH2_ADDRESS,
        SWISE_ADDRESS,
        FEI_ADDRESS,
        TRIBE_ADDRESS,
        renBTC_ADDRESS,
        NFTX_ADDRESS,
        OHM_ADDRESS,
        SNX_ADDRESS,
        FTM_ADDRESS,
        WBTC_ADDRESS,
        UNI_ADDRESS,
        BUSD_ADDRESS,
        MAI_ADDRESS,
        TUSD_ADDRESS,
        ANKR_ADDRESS,
        AAVE_ADDRESS,
        COMP_ADDRESS,
        JPY_ADDRESS,
        LUSD_ADDRESS,
        WETH9_ADDRESS,
        WNATIVE_ADDRESS,
        SUSHI_ADDRESS,
        XSUSHI_ADDRESS,
        USDC_ADDRESS,
        USDT_ADDRESS,
        DAI_ADDRESS,
        MIM_ADDRESS,
        FRAX_ADDRESS,
        FXS_ADDRESS,
        BCT_ADDRESS,
        KLIMA_ADDRESS,
        QUICK_ADDRESS,
        OP_ADDRESS,
        LINK_ADDRESS,
        AGEUR_ADDRESS,
    ]
    const MAPPING = AddressMapper.generate([...addressLists]);

    test("Get all weth addresses", async () => {
        const expected = Object.keys(WNATIVE_ADDRESS).length - 1 // minus one, exclude itself 
        const actual = Object.values(MAPPING[`${ChainId.ETHEREUM}:${WETH9_ADDRESS[ChainId.ETHEREUM].toLowerCase()}`]).length
        expect(actual).toEqual(expected);
    });
    
    test("Get all sushi addresses for the top networks given thundercores sushi address", async () => {

        const actual = MAPPING[`${ChainId.THUNDERCORE}:${SUSHI_ADDRESS[ChainId.THUNDERCORE].toLowerCase()}`]

        expect(actual[ChainId.ETHEREUM]).length(1);
        expect(actual[ChainId.ETHEREUM][0]).toEqual(SUSHI_ADDRESS[ChainId.ETHEREUM].toLowerCase());
        
        expect(actual[ChainId.ARBITRUM]).length(1);
        expect(actual[ChainId.ARBITRUM][0]).toEqual(SUSHI_ADDRESS[ChainId.ARBITRUM].toLowerCase());
        
        expect(actual[ChainId.POLYGON]).length(1);
        expect(actual[ChainId.POLYGON][0]).toEqual(SUSHI_ADDRESS[ChainId.POLYGON].toLowerCase());
        
        expect(actual[ChainId.OPTIMISM]).length(1);
        expect(actual[ChainId.OPTIMISM][0]).toEqual(SUSHI_ADDRESS[ChainId.OPTIMISM].toLowerCase());
    });
});
