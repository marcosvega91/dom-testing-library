import prettyFormat from 'pretty-format'
import {getUserCodeFrame} from './get-user-code-frame'
import {getDocument} from './helpers'
import {Nullish} from './types'

function inCypress(dom) {
  const window =
    (dom.ownerDocument && dom.ownerDocument.defaultView) || undefined
  return (
    (typeof global !== 'undefined' && global.Cypress) ||
    (typeof window !== 'undefined' && window.Cypress)
  )
}

const inNode = () =>
  typeof process !== 'undefined' &&
  'versions' in process &&
  'node' in process.versions

const getMaxLength = (dom): number =>
  inCypress(dom)
    ? 0
    : (typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT) || 7000

const {DOMElement, DOMCollection} = prettyFormat.plugins

function prettyDOM(
  dom?: Nullish<Element | HTMLDocument>,
  maxLength?: number,
  options?: prettyFormat.OptionsReceived,
): string | false {
  if (!dom) {
    dom = getDocument().body
  }
  if (typeof maxLength !== 'number') {
    maxLength = getMaxLength(dom)
  }

  if (maxLength === 0) {
    return ''
  }
  if ('documentElement' in dom) {
    dom = dom.documentElement
  }

  let domTypeName = typeof dom
  if (domTypeName === 'object') {
    domTypeName = dom.constructor.name
  } else {
    // To don't fall with `in` operator
    dom = undefined
  }
  if (!dom || !('outerHTML' in dom)) {
    throw new TypeError(
      `Expected an element or document but got ${domTypeName}`,
    )
  }

  const debugContent = prettyFormat(dom, {
    plugins: [DOMElement, DOMCollection],
    printFunctionName: false,
    highlight: inNode(),
    ...options,
  })
  return dom.outerHTML.length > maxLength
    ? `${debugContent.slice(0, maxLength)}...`
    : debugContent
}

const logDOM = (...args) => {
  const userCodeFrame = getUserCodeFrame()
  if (userCodeFrame) {
    console.log(`${prettyDOM(...args)}\n\n${userCodeFrame}`)
  } else {
    console.log(prettyDOM(...args))
  }
}

export {prettyDOM, logDOM, prettyFormat}
