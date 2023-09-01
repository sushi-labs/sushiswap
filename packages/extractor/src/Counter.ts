export class Counter {
  counter = 0
  onCounterChanged: (arg: number) => void

  constructor(callBack: (arg: number) => void) {
    this.onCounterChanged = callBack
  }

  inc() {
    ++this.counter
    this.onCounterChanged(this.counter)
  }

  dec() {
    --this.counter
    this.onCounterChanged(this.counter)
  }
}
