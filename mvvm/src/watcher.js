import Dep from './dep'

export default class Watcher {
  constructor (vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    this.value = this.get()
  }

  get () {
    Dep.target = this
    const value = this.getVal(this.vm, this.expr)
    Dep.target = null
    return value
  }

  getVal (vm, expr) {
    expr = expr.split('.')
    return expr.reduce((pre, next) => {
      return pre[next]
    }, vm.$data)
  }

  update () {
    const newVal = this.getVal(this.vm, this.expr)
    const oldVal = this.value
    if (newVal !== oldVal) {
      this.cb(newVal)
    }
  }
}
