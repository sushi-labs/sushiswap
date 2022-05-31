export class Warning {
  active = false
  message = ''
  breaking = false
  or: Warning | undefined = undefined

  constructor(active: boolean, message: string, breaking = false, or?: Warning) {
    this.active = active
    this.message = message
    this.breaking = breaking
    this.or = or
  }
}

export class Warnings extends Array<Warning> {
  private _add(warning: Warning) {
    if (warning.active) {
      this.push(warning)
    } else {
      if (warning.or) {
        this._add(warning.or)
      }
    }
  }

  add(active: boolean, message: string, breaking = false, or?: Warning) {
    this._add(new Warning(active, message, breaking, or))
    return this
  }

  addWarning(active: boolean, message: string, or?: Warning) {
    this._add(new Warning(active, message, false, or))
    return this
  }

  addError(active: boolean, message: string, or?: Warning) {
    this._add(new Warning(active, message, true, or))
    return this
  }

  get broken(): boolean {
    return this.some((warning) => warning.breaking)
  }
}
