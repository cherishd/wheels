const compiler = require('./index').compiler

const code = `(add 2 (subtract 4 2))`
const res = compiler(code)

console.log(res)
