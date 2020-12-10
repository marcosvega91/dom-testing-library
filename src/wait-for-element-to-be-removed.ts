import {waitFor, WaitForOptions} from './wait-for'
import {Callback} from './types'

const isRemoved = (result: T) =>
  !result || (Array.isArray(result) && !result.length)

// Check if the element is not present.
// As the name implies, waitForElementToBeRemoved should check `present` --> `removed`
function initialCheck<T>(elements: T) {
  if (isRemoved(elements)) {
    throw new Error(
      'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
    )
  }
}

async function waitForElementToBeRemoved<T>(
  elementOrCallback: Callback<T> | T,
  options: WaitForOptions,
) {
  // created here so we get a nice stacktrace
  const timeoutError = new Error('Timed out in waitForElementToBeRemoved.')
  let callback: Callback<Element | null>
  if (typeof elementOrCallback !== 'function') {
    initialCheck(elementOrCallback)
    const elements: Element[] = Array.isArray(elementOrCallback)
      ? elementOrCallback
      : [elementOrCallback]
    const getRemainingElements = elements.map(element => {
      let parent = element.parentElement
      while (parent?.parentElement) parent = parent.parentElement
      return () => (parent?.contains(element) ? element : null)
    })
    callback = () => getRemainingElements.map(c => c()).filter(Boolean)
  }

  initialCheck(callback())

  return waitFor(() => {
    let result
    try {
      result = callback()
    } catch (error) {
      if (error.name === 'TestingLibraryElementError') {
        return undefined
      }
      throw error
    }
    if (!isRemoved(result)) {
      throw timeoutError
    }
    return undefined
  }, options)
}

export {waitForElementToBeRemoved}

/*
eslint
  require-await: "off"
*/
