import { State, isString, move } from './util'

export default function diff (oldDomTree, newDomTree) {
  let patches = []
  dfs(oldDomTree, newDomTree, 0, patches)
  return patches
}

function dfs (oldNode, newNode, index, patches) {
  let curPatches = []
  if (!newNode) {  // skip
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    let props = diffProps(oldNode.props, newNode.props)
    if (props.length) {
      curPatches.push({
        type: State.ChangeProps,
        props
      })
    }
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    curPatches.push({
      type: State.Replace,
      node: newNode
    })
  }
  if (curPatches.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(curPatches)
    } else {
      patches[index] = curPatches
    }
  }
}

function diffProps (oldProps, newProps) {
  let changes = []
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      changes.push({
        prop: key
      })
    }
  }
  for (const key in newProps) {
    if (!oldProps[key] || oldProps[key] !== newProps[key]) {
      changes.push({
        prop: key,
        value: newProps[key]
      })
    }
  }
  return changes
}

function diffChildren (oldChild, newChild, index, patches) {
  const { changes, list } = listDiff(oldChild, newChild)
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes)
    } else {
      patches[index] = changes
    }
  }
  let last = null
  oldChild && oldChild.forEach((item, i) => {
    const children = item && item.children
    if (children) {
      index = last && last.children ? index + last.children.length + 1 : index + 1
      const keyIndex = list.indexOf(item.key)
      const node = newChild[keyIndex]
      if (node) {
        dfs(item, node, index, patches)
      }
    } else {
      index += 1
    }
    last = item
  })
}

function listDiff (oldList, newList) {
  const newKeys = getKeys(newList)
  const changes = []

  const list = []
  oldList && oldList.forEach((item, i) => {
    const key = item.key
    const index = newKeys.indexOf(key)
    if (index === -1) {
      changes.push({
        type: State.Remove,
        index: i
      })
    } else {
      list.push(key)
    }
  })
  newList && newList.forEach((item, i) => {
    const key = item.key
    const index = list.indexOf(key)
    if (index === -1 || key == null) {
      changes.push({
        type: State.Insert,
        node: item,
        index: i
      })
      list.splice(i, 0, key)
    } else {
      if (index !== i) {
        changes.push({
          type: State.Move,
          from: index,
          to: i
        })
        move(list, index, i)
      }
    }
  })
  return { changes, list }
}

function getKeys (list) {
  const keys = []
  list.forEach(item => {
    keys.push(item.key)
  })
  return keys
}
