export const State = {
  ChangeText: 'CHANGE_TEXT',
  ChangeProps: 'CHANGE_PROPS',
  Insert: 'INSERT',
  Move: 'MOVE',
  Remove: 'REMOVE',
  Replace: 'REPLACE'
}

export function isString (str) {
  return typeof str === 'string'
}

export function move (arr, oldIndex, newIndex) {
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
}
