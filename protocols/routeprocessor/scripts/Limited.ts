
function getTrottle(times: number, intervalMS: number): () => void {
    const lastTrorrledCalls: number[] = []
    const trottle = async () => {
        const now = Date.now()
        while(lastTrorrledCalls.length > 0) {
            const first = lastTrorrledCalls[0]
            if ((now - first) < intervalMS) break
            lastTrorrledCalls.shift()
        }
        if (lastTrorrledCalls.length < times) {
            lastTrorrledCalls.push(now)
            return
        }
        await new Promise(resolve => setTimeout(resolve, intervalMS + lastTrorrledCalls[0] - now + 1))
        await trottle()
    }
    return trottle
}

export class Limited {
    trottle: () => void
    counterTotalCall: number
    counterFailedCall: number

    constructor(times: number, intervalMS: number) {
        this.trottle = getTrottle(times, intervalMS)
        this.counterTotalCall = 0
        this.counterFailedCall = 0
    }

    async call<T>(func: () => Promise<T>): Promise<T> {
        while(1) {
            await this.trottle()
            ++this.counterTotalCall
            //console.log(this.counterTotalCall);
            try {
                return await func()
            } catch (e) {
                ++this.counterFailedCall
                //console.log('Fail!!! Retry'+this.counterFailedCall+' successed: '+(this.counterTotalCall -this.counterFailedCall))
            }
        }
    }

    async callOnce<T>(func: () => Promise<T>): Promise<T> {
        await this.trottle()
        ++this.counterTotalCall
        return await func()
    }

}