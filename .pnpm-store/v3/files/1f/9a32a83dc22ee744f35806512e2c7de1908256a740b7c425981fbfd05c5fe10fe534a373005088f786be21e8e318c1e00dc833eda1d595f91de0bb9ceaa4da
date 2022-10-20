import sushi = require("./typings/sushi");
import blocks = require("./typings/blocks");
import charts = require("./typings/charts");
import exchange = require("./typings/exchange");
import exchange_v1 = require("./typings/exchange_v1");
import masterchef = require("./typings/masterchef");
import bar = require("./typings/bar");
import maker = require("./typings/maker");
import timelock = require("./typings/timelock");
import lockup = require("./typings/lockup");
import utils = require("./typings/utils")
import bentobox = require("./typings/bentobox");

export = SushiData;
export as namespace SushiData;

declare namespace SushiData {

    export declare function timeseries({ blocks, timestamps, target }: {
        blocks?: number[];
        timestamps?: number[];
        target: Function;
    }, targetArguments?: any): Promise<any>;

    export { sushi, blocks, charts, exchange, exchange_v1, masterchef, bar, maker, timelock, lockup, utils, bentobox };
}
