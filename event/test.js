const EventEmitter = require('./index')

let e = new EventEmitter()
e.addListener('test', (v) => {
  console.log('fn1 ' + v)
})
e.addListener('test', (v) => {
  console.log('fn2 ' + v)
})
e.emit('test', 111)
