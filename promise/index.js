class Promise {
  constructor (executor) {
    // 初始态为 pending
    this.state = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    const resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled'
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    const promise = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })
    return promise
  }

  catch (fn) {
    return this.then(null, fn)
  }
}
Promise.resolve = value => new Promise((resolve, reject) => resolve(value))
Promise.reject = value => new Promise((resolve, reject) => reject(value))
Promise.race = promises => {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      promise.then(resolve, reject)
    })
  })
}
Promise.all = promises => {
  let arr = []
  let i = 0
  function processData (index, data) {
    arr[index] = data
    i++
    if (i === promises.length) {
      resolve(arr)
    }
  }
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      promise.then(data => {
        processData(index, data)
      }, reject)
    })
  })
}

function resolvePromise (promise, x, resolve, reject) {
  if (x === promise) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject)
        }, err => {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

module.exports = Promise
