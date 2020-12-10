/* eslint-disable @typescript-eslint/no-explicit-any */
import * as defaultQueries from './queries'

export type BoundFunction<T> = T extends (
  attribute: string,
  element: HTMLElement,
  text: infer P,
  options: infer Q,
) => infer R
  ? (text: P, options?: Q) => R
  : T extends (
      a1: any,
      text: infer P,
      options: infer Q,
      waitForElementOptions: infer W,
    ) => infer R
  ? (text: P, options?: Q, waitForElementOptions?: W) => R
  : T extends (a1: any, text: infer P, options: infer Q) => infer R
  ? (text: P, options?: Q) => R
  : never

export type BoundFunctions<T> = {[P in keyof T]: BoundFunction<T[P]>}

export type Query = (
  container: Element,
  ...args: any[]
) => Error | Promise<Element[]> | Promise<Element> | Element[] | Element | null

export interface Queries {
  [T: string]: Query
}

export interface AAA extends Queries {
  aaaa: Query
}
/**
 * @typedef {{[key: string]: Function}} FuncMap
 */

/**
 * @param {Element} element container
 * @param {FuncMap} queries object of functions
 * @param {Object} initialValue for reducer
 * @returns {FuncMap} returns object of functions bound to container
 */
function getQueriesForElement<T extends typeof defaultQueries>(
  container: Element,
  queries: T,
  initialValue?: BoundFunctions<T>,
): BoundFunctions<T> {
  return Object.keys(queries).reduce((helpers, key) => {
    const fn = queries[key]
    helpers[key] = fn.bind(null, container)
    return helpers
  }, initialValue ?? {})
}

export {getQueriesForElement}
