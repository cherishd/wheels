import { State, isString } from './util'
import Element from './element'

export default function patch(node, patches, index = 0) {
  const changes = patches[index]
  const childNodes = node && node.childNodes
  if (!childNodes) {
    index += 1
  }
  if (changes && changes.length && patches[index]) {
    changeDom(node, changes)
  }
  let last = null
  if (childNodes && childNodes.length) {
    childNodes.forEach(item => {
      index = last && last.children ? index + last.children.length + 1 : index + 1
      patch(item, patches, index)
      last = item
    })
  }
}

function changeDom (node, changes) {
  changes.forEach(change => {
    switch (change.type) {
      case State.ChangeProps:
        change.props.forEach(item => {
          if (item.value) {
            node.setAttribute(item.prop, item.value)
          } else {
            node.removeAttribute(item.prop)
          }
        })
        break
      case State.Remove:
        node.childNodes[change.index].remove()
        break
      case State.Insert:
        let dom
        if (isString(change.node)) {
          dom = document.createTextNode(change.node)
        } else if (change.node instanceof Element) {
          dom = change.node.create()
        }
        node.insertBefore(dom, node.childNodes[change.index])
        break
      case State.Replace:
        node.parentNode.replaceChild(change.node.create(), node)
        break
      case State.Move:
        const fromNode = node.childNodes[change.from]
        const toNode = node.childNodes[change.to]
        const cloneFromNode = fromNode.cloneNode(true)
        const cloneToNode = toNode.cloneNode(true)
        node.replaceChild(cloneFromNode, toNode)
        node.replaceChild(cloneToNode, fromNode)
        break
      default:
        break
    }
  })
}
