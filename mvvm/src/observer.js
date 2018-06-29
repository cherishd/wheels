import Dep from './dep'

export default class Observer {
  constructor (data) {
    this.observe(data)
  }

  observe (data) {
    if (!data || typeof data !== 'object') {
      return
    }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
      this.observe(data[key])
    })
  }

  defineReactive (obj, key, value) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newVal) {
        if (newVal !== value) {
          value = newVal
          dep.notify()
        }
      }
    })
  }
}
