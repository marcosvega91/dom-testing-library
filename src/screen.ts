import {compressToEncodedURIComponent} from 'lz-string'
import * as queries from './queries'
import {getQueriesForElement} from './get-queries-for-element'
import {logDOM} from './pretty-dom'
import {getDocument} from './helpers'

function unindent(text: string) {
  // remove white spaces first, to save a few bytes.
  // testing-playground will reformat on load any ways.
  return text.replace(/[ \t]*[\n][ \t]*/g, '\n')
}

function encode(text: string) {
  return compressToEncodedURIComponent(unindent(text))
}

function getPlaygroundUrl(markup: string) {
  return `https://testing-playground.com/#markup=${encode(markup)}`
}

const debug = (element, maxLength: number, options) =>
  Array.isArray(element)
    ? element.forEach(el => logDOM(el, maxLength, options))
    : logDOM(element, maxLength, options)

const logTestingPlaygroundURL = (element = getDocument().body) => {
  if (!element || !('innerHTML' in element)) {
    console.log(`The element you're providing isn't a valid DOM element.`)
    return
  }
  if (!element.innerHTML) {
    console.log(`The provided element doesn't have any children.`)
    return
  }
  console.log(
    `Open this URL in your browser\n\n${getPlaygroundUrl(element.innerHTML)}`,
  )
}

const initialValue = {debug, logTestingPlaygroundURL}
export const screen =
  typeof document !== 'undefined' && document.body
    ? getQueriesForElement(document.body, queries, initialValue)
    : Object.keys(queries).reduce((helpers, key) => {
        helpers[key] = () => {
          throw new TypeError(
            'For queries bound to document.body a global document has to be available... Learn more: https://testing-library.com/s/screen-global-error',
          )
        }
        return helpers
      }, initialValue)
