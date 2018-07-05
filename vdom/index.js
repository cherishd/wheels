import Element from './src/element'
import diff from './src/diff'
import patch from './src/patch'

const el3 = new Element('div', { class: 'el3' }, ['el3'], 'el3')
const el4 = new Element('span', { class: 'el4' }, ['el4'], 'el4')

const el1 = new Element('div', { class: 'el1' }, [el3])
const el2 = new Element('div', { class: 'el2' }, [el4])

const root = el1.render()
const patches = diff(el1, el2)

setTimeout(() => {
  patch(root, patches)
}, 1000)
