import {TEXT_NODE} from './helpers'

function getNodeText(node: Node | Element | HTMLInputElement) {
  if (
    'matches' in node &&
    node.matches('input[type=submit], input[type=button]') &&
    'value' in node
  ) {
    return node.value
  }

  return Array.from(node.childNodes)
    .filter(child => child.nodeType === TEXT_NODE && Boolean(child.textContent))
    .map(c => c.textContent)
    .join('')
}

export {getNodeText}
