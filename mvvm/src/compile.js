import Watcher from './watcher'

function isElementNode (node) {
  return node.nodeType === 1
}
function isDirective (name) {
  return name.includes('v-')
}

export default class Compile {
  constructor (el, vm) {
    this.el = isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    if (this.el) {
      const fragment = this.nodeToFragment(this.el)
      this.compile(fragment)
      this.el.appendChild(fragment)
    }
  }

  nodeToFragment (el) {
    const fragment = document.createDocumentFragment()
    let firstChild
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }

  compile (fragment) {
    const childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (isElementNode(node)) {
        this.compileElement(node)
        this.compile(node)
      } else {
        this.compileText(node)
      }
    })
  }

  compileElement (node) {
    const attrs = node.attributes
    Array.from(attrs).forEach(attr => {
      const attrName = attr.name
      if (isDirective(attrName)) {
        const expr = attr.value
        const type = attrName.slice(2)
        CompileUtil[type](node, this.vm, expr)
      }
    })
  }

  compileText (node) {
    const text = node.textContent
    if (/\{\{([^}]+)\}\}/g.test(text)) {
      CompileUtil['text'](node, this.vm, text)
    }
  }
}

const CompileUtil = {
  getVal (vm, expr) {
    expr = expr.split('.')
    return expr.reduce((pre, next) => {
      return pre[next]
    }, vm.$data)
  },
  setVal (vm, expr, value) {
    expr = expr.split('.')
    return expr.reduce((pre, next, currentIndex) => {
      if (currentIndex === expr.length - 1) {
        return pre[next] = value
      }
      return pre[next]
    }, vm.$data)
  },
  getTextVal (vm, text) {
    return text.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      return this.getVal(vm, args[1].trim())
    })
  },
  text (node, vm, text) {
    const updateFn = this.updater['textUpdater']
    const value = this.getTextVal(vm, text)
    text.replace(/\{\{([^}]+)\}\}/g, (...args) => {
      new Watcher(vm, args[1].trim(), newVal => {
        const updateFn = this.updater['textUpdater']
        updateFn(node, this.getTextVal(vm, newVal))
      })
    })
    updateFn(node, value)
  },
  model (node, vm, expr) {
    const updateFn = this.updater['modelUpdater']
    new Watcher(vm, expr, newVal => {
      updateFn(node, newVal)
    })
    node.addEventListener('input', e => {
      this.setVal(vm, expr, e.target.value)
    })
    updateFn(node, this.getVal(vm, expr))
  },
  updater: {
    textUpdater (node, value) {
      node.textContent = value
    },
    modelUpdater (node, value) {
      node.value = value
    }
  }
}

