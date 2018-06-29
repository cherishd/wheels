import MVVM from './src/index'

new MVVM({
  el: '#app',
  data: {
    message: 'Hello World',
    info: {
      a: 'Test'
    }
  }
})
