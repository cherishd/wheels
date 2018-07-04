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

  render () {
    const root = this._createElement(
      this.tag,
      this.props,
      this.children,
      this.key
    )
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
            element.tag,
            element.props,
            element.children,
            element.key
          )
        } else {
          element = document.createTextNode(element)
        }
        el.appendChild(element)
      })
    }
    return el
  }
}
