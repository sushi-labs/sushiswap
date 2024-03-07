// expected: marks are Data.now()
export class HistoryManager<T> {
  records: T[] = []
  marks: number[] = []
  markPlace: Map<number, number> = new Map()
  forgottenRecords = 0
  // each cleanUpTiming ms a code is launched that forgets all history earlier than cleanUpTiming ms
  readonly cleanUpTiming: number

  constructor(cleanUpTiming: number) {
    this.cleanUpTiming = cleanUpTiming
    this.intervalHistoryForget()
  }

  addRecord(r: T) {
    // no sence to keep records without marks
    if (this.marks.length > 0) this.records.push(r)
  }

  setMark(mark: number) {
    if (this.marks.length > 0 && this.marks[this.marks.length - 1] === mark)
      return
    this.marks.push(mark)
    this.markPlace.set(mark, this.records.length + this.forgottenRecords)
  }

  isMarkExist(mark: number) {
    return this.markPlace.get(mark) !== undefined
  }

  getRecords(fromMark: number, newMark?: number) {
    if (newMark) this.setMark(newMark)
    const markPlace = this.markPlace.get(fromMark)
    if (!markPlace) return undefined
    return { records: this.records, from: markPlace - this.forgottenRecords }
  }

  forgetAllHistory() {
    this.records = []
    this.marks = []
    this.markPlace = new Map()
    this.forgottenRecords = 0
  }

  forgetHistory(mark: number) {
    const nextMark = this.marks.findIndex((m) => m >= mark)
    if (nextMark === 0) return // nothing to forget

    if (nextMark < 0) this.forgetAllHistory()
    else {
      const forgetRecordsNum = this.markPlace.get(this.marks[nextMark])
      if (forgetRecordsNum === undefined)
        console.log(`HistoryManager: unknown mark ${nextMark}`)
      else {
        if (forgetRecordsNum > 0) {
          this.records.splice(0, forgetRecordsNum)
          this.forgottenRecords += forgetRecordsNum
        }
        for (let i = 0; i < nextMark; ++i) {
          if (!this.markPlace.delete(this.marks[i])) {
            console.log(`HistoryManager: unknown mark ${this.marks[i]}`)
          }
        }
        this.marks.splice(0, nextMark)
        if (this.marks.length !== this.markPlace.size)
          console.log(
            `HistoryManager: inconsistency state ${this.marks.length} === ${this.markPlace.size}`,
          )
        if (this.marks[0] !== 0)
          console.log(
            `HistoryManager: inconsistency state mark[0] ${this.marks[0]}`,
          )
      }
    }
  }

  intervalHistoryForget() {
    this.forgetHistory(Date.now() - this.cleanUpTiming)
    setTimeout(() => this.intervalHistoryForget(), this.cleanUpTiming)
  }

  getDebugInfo(maxLength = 64): (number | T | string)[] {
    const res: (number | T | string)[] = []
    let error = false
    for (let i = 0; i < this.marks.length; ++i) {
      const m = this.marks[i]
      res.push(m)
      const place = this.markPlace.get(m)
      if (place === undefined) {
        res.push('This mark has no place !!!')
        error = true
        break
      }
      const placeNext =
        i + 1 === this.marks.length
          ? this.records.length + this.forgottenRecords
          : this.markPlace.get(this.marks[i + 1])
      if (placeNext === undefined) {
        res.push('Next mark has no place !!!')
        error = true
        break
      }
      for (let j = place; j < placeNext; ++j) {
        const p = j - this.forgottenRecords
        if (p < 0 || p >= this.records.length) {
          res.push(`Wrong record index ${p}`)
          error = true
          break
        }
        res.push(this.records[p])
      }
    }
    if (!error && res.length !== this.marks.length + this.records.length) {
      res.push(
        `Wrong result length: ${res.length} !== ${this.marks.length} + ${this.records.length}`,
      )
    }
    if (maxLength > 0 && res.length > maxLength) {
      res.splice(maxLength / 2, res.length - maxLength - 1, '...')
    }
    return res
  }
}
