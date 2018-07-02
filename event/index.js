class EventEmitter {
  constructor () {
    this._events = new Map()
  }

  addListener (type, fn) {
    const events = this._events
    const handlers = events.get(type) || []
    handlers.push(fn)
    events.set(type, handlers)
    return fn
  }

  emit (type, ...args) {
    const events = this._events
    const handlers = events.get(type)
    if (!handlers) return
    handlers.forEach(handler => {
      handler.apply(this, args)
    })
  }

  removeListener (type, fn) {
    const events = this._events
    const handlers = event.get(type)
    if (!handlers) return false
    handlers.forEach((handler, i) => {
      if (fn === handler) {
        handlers.splice(i, 1)
      }
    })
    return true
  }

  removeAllListeners () {
    this._events = new Map()
    return true
  }
}

module.exports = EventEmitter
