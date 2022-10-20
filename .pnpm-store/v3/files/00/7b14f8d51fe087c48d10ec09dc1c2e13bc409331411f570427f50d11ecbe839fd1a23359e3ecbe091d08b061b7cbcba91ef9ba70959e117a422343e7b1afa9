const SolidityListener = require('./grammar/SolidityListener').SolidityListener

class SecurityErrorListener extends SolidityListener {
  constructor(checkers) {
    super()
    this.listenersMap = {}

    checkers.forEach(i => this.addChecker(i))
  }

  addChecker(newChecker) {
    const listenerMethods = Object.getOwnPropertyNames(SolidityListener.prototype)

    const usedListenerMethods = listenerMethods
      .filter(i => i !== 'constructor')
      .filter(i => !!newChecker[i])

    usedListenerMethods.forEach(methodName => this.addNewListener(methodName, newChecker))

    usedListenerMethods.forEach(methodName => {
      this[methodName] = this.notifyListenersOn(methodName)
    })
  }

  listenersFor(name) {
    return this.listenersMap[name] || []
  }

  addNewListener(methodName, checker) {
    const method = checker[methodName].bind(checker)
    const listeners = this.listenersFor(methodName)
    this.listenersMap[methodName] = listeners.concat(method)
  }

  notifyListenersOn(methodName) {
    return ctx => this.listenersFor(methodName).forEach(fn => quite(fn)(ctx))
  }
}

function quite(fn) {
  return (...args) => {
    try {
      if (fn) {
        fn.call(fn, ...args)
      }
    } catch (err) {
      // console.log(err);
    }
  }
}

module.exports = SecurityErrorListener
