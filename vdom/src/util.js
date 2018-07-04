export const State = {
  ChangeText: 0,
  ChangeProps: 1,
  Insert: 2,
  Move: 3,
  Remove: 4,
  Replace: 5
}

export function isString (str) {
  return typeof str === 'string'
}

export function move (arr, oldIndex, newIndex) {
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
}
