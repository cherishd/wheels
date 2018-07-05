import { isString } from './util'

export default class Element {
  constructor (tag, props, children, key) {
    this.tag = tag
    this.props = props
    if (Array.isArray(children)) {
      this.children = children
    } else if (isString(children)) {
      this.key = children
      this.children = null
    }
    if (key) {
      this.key = key
    }
  }

  create () {
    const root = this._createElement(
      this.tag,
      this.props,
      this.children,
      this.key
    )
    return root
  }

  render () {
    const root = this.create()
    document.body.appendChild(root)
    return root
  }

  _createElement (tag, props, children, key) {
    const el = document.createElement(tag)
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        el.setAttribute(key, props[key])
      }
    }
    if (key) {
      el.setAttribute('key', key)
    }
    if (children) {
      children.forEach(child => {
        let element
        if (child instanceof Element) {
          element = this._createElement(
            child.tag,
            child.props,
            child.children,
            child.key
          )
        } else {
          element = document.createTextNode(child)
        }
        el.appendChild(element)
      })
    }
    return el
  }
}
