const {
    getWeek,
    subWeeks,
    subYears,
    startOfMinute,
    getUnixTime
} = require("date-fns");

const { TWENTY_FOUR_HOURS } = require('./../constants');
const { dayData, tokenHourData, tokenDayData, pairHourData, pairDayData, ethPriceHourly } = require('./exchange');

module.exports = {
    async factory() {
        let data = await dayData();
        let weeklyData = [];

        let startIndexWeekly = -1;
        let currentWeek = -1;

        data.forEach((entry, i) => {
            const week = getWeek(data[i].date)

            if (week !== currentWeek) {
                currentWeek = week;
                startIndexWeekly++;
            }

            weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {};
            weeklyData[startIndexWeekly].date = data[i].date;
            weeklyData[startIndexWeekly].weeklyVolumeUSD = ((
                weeklyData[startIndexWeekly].weeklyVolumeUSD ? 
                    weeklyData[startIndexWeekly].weeklyVolumeUSD : 0) + data[i].volumeUSD
                );
          });

        return [data, weeklyData];
    },

    async tokenHourly({token_address = undefined, startTime = undefined}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }

        let [tokenData, ethPrices] = await Promise.all([
             tokenHourData({minTimestamp: startTime, token_address}),
             ethPriceHourly({minTimestamp: startTime})]);

        tokenData = tokenData.map(tokenEntry => {
            const ethPriceUSD = ethPrices.find(ethEntry => ethEntry.timestamp === tokenEntry.timestamp).priceUSD;
            return ({
            ...tokenEntry,
            priceUSD: tokenEntry.derivedETH * ethPriceUSD,
        })});

        tokenData = tokenData.map((tokenEntry, i) => ({
            ...tokenEntry,
            volume: tokenData[i-1] ? tokenEntry.volume - tokenData[i-1].volume : undefined,
            volumeUSD: tokenData[i-1] ? tokenEntry.volumeUSD - tokenData[i-1].volumeUSD : undefined,
            untrackedVolumeUSD: tokenData[i-1] ? tokenEntry.untrackedVolumeUSD - tokenData[i-1].untrackedVolumeUSD : undefined,

            txCount: tokenData[i-1] ? tokenEntry.txCount - tokenData[i-1].txCount : undefined,

            open: tokenEntry.priceUSD,
            close: tokenData[i+1] ? tokenData[i+1].priceUSD : undefined,
        }));

        return tokenData;
    },

    async tokenDaily({token_address = undefined} = {}) {
        if(!token_address) { throw new Error("sushi-data: Token address undefined"); }
        
        let data = await tokenDayData({token_address});
        const endTime = getUnixTime(new Date());
        const startTime = getUnixTime(startOfMinute(subYears(new Date(), 1)));

        let dayIndexSet = new Set();
        let dayIndexArray = [];

        data.forEach((dayData, i) => {
        // add the day index to the set of days
            dayIndexSet.add((data[i].timestamp / TWENTY_FOUR_HOURS).toFixed(0));
            dayIndexArray.push(data[i]);
        });

        // fill in empty days
        let timestamp = data[0] && data[0].timestamp ? data[0].timestamp : startTime;
        let latestLiquidity = data[0] && data[0].liquidity;
        let latestLiquidityUSD = data[0] && data[0].liquidityUSD;
        let latestLiquidityETH = data[0] && data[0].liquidityETH;
        let latestPriceUSD = data[0] && data[0].priceUSD;
        let index = 1;

        while (timestamp < endTime - TWENTY_FOUR_HOURS) {
            const nextDay = timestamp + TWENTY_FOUR_HOURS;
            let currentDayIndex = (nextDay / TWENTY_FOUR_HOURS).toFixed(0);
            if (!dayIndexSet.has(currentDayIndex)) {
                data.push({
                    id: `${data[0].id.split("-")[0]}-${nextDay / TWENTY_FOUR_HOURS}`,
                    date: new Date(nextDay * 1000),
                    timestamp: nextDay,
                    volume: 0,
                    volumeETH: 0,
                    volumeUSD: 0,
                    liquidity: latestLiquidity,
                    liquidityETH: latestLiquidityETH,
                    liquidityUSD: latestLiquidityUSD,
                    priceUSD: latestPriceUSD,
                    txCount: 0
                });
            } else {
                latestLiquidity = dayIndexArray[index].liquidity;
                latestLiquidityETH = dayIndexArray[index].liquidityETH;
                latestLiquidityUSD = dayIndexArray[index].liquidityUSD;

                latestPriceUSD = dayIndexArray[index].priceUSD;
                index = index + 1;
            }
            timestamp = nextDay;
        }
        
        data = data.sort((a, b) => (parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1));

        return data;
    },

    async pairHourly({pair_address = undefined, startTime = undefined}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }

        let pairData = await pairHourData({minTimestamp: startTime, pair_address});

        pairData = pairData.map((pairEntry, i) => ({
            ...pairEntry,
            volumeToken0: pairData[i-1] ? pairEntry.volumeToken0 - pairData[i-1].volumeToken0 : undefined,
            volumeToken1: pairData[i-1] ? pairEntry.volumeToken1 - pairData[i-1].volumeToken1 : undefined,

            rate0: {
                open: pairEntry.token0Price,
                close: pairData[i+1] ? pairData[i+1].token0Price : undefined,
            },

            rate1: {
                open: pairEntry.token1Price,
                close: pairData[i+1] ? pairData[i+1].token1Price : undefined,
            },

            txCount: pairData[i-1] ? pairEntry.txCount - pairData[i-1].txCount : undefined,
        }));

        return pairData;
    },

    async pairDaily({pair_address = undefined} = {}) {
        if(!pair_address) { throw new Error("sushi-data: Pair address undefined"); }

        let data = await pairDayData({pair_address});
        const endTime = getUnixTime(new Date());
        const startTime = getUnixTime(startOfMinute(subYears(new Date(), 1)));
        
        let dayIndexSet = new Set();
        let dayIndexArray = [];

        data.forEach((dayData, i) => {
            // add the day index to the set of days
            dayIndexSet.add((data[i].timestamp / TWENTY_FOUR_HOURS).toFixed(0));
            dayIndexArray.push(data[i]);
        });
      
        let timestamp = data[0].timestamp ? data[0].timestamp : startTime;
        let latestLiquidityUSD = data[0].liquidityUSD;
        let index = 1;

        while (timestamp < endTime - TWENTY_FOUR_HOURS) {
            const nextDay = timestamp + TWENTY_FOUR_HOURS;
            let currentDayIndex = (nextDay / TWENTY_FOUR_HOURS).toFixed(0);
            if (!dayIndexSet.has(currentDayIndex)) {
                data.push({
                    id: `${data[0].id.split("-")[0]}-${nextDay / TWENTY_FOUR_HOURS}`,
                    date: new Date(nextDay * 1000),
                    timestamp: nextDay,
                    volumeUSD: 0,
                    volumeToken0: 0,
                    volumeToken1: 0,
                    liquidityUSD: latestLiquidityUSD,
                    txCount: 0
                });
            } else {
                latestLiquidityUSD = dayIndexArray[index].liquidityUSD;

                index = index + 1;
            }
            timestamp = nextDay;
        }

        data = data.sort((a, b) => (parseInt(a.timestamp) > parseInt(b.timestamp) ? 1 : -1));

        return data;
    }
}