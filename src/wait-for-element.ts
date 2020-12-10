import {waitFor, WaitForOptions} from './wait-for'
import {Callback} from './types'
let hasWarned = false

// deprecated... TODO: remove this method. People should use a find* query or
// wait instead the reasoning is that this doesn't really do anything useful
// that you can't get from using find* or wait.
async function waitForElement<T>(
  callback: Callback<T>,
  options: WaitForOptions,
) {
  if (!hasWarned) {
    hasWarned = true
    console.warn(
      `\`waitForElement\` has been deprecated. Use a \`find*\` query (preferred: https://testing-library.com/docs/dom-testing-library/api-queries#findby) or use \`waitFor\` instead: https://testing-library.com/docs/dom-testing-library/api-async#waitfor`,
    )
  }
  if (!callback) {
    throw new Error('waitForElement requires a callback as the first parameter')
  }
  return waitFor(() => {
    const result = callback()
    if (!result) {
      throw new Error('Timed out in waitForElement.')
    }
    return result
  }, options)
}

export {waitForElement}

/*
eslint
  require-await: "off"
*/