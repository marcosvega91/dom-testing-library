import {
  queryAllByAttribute,
  buildQueries,
  Matcher,
  MatcherOptions,
  checkContainerType,
  wrapAllByQueryWithSuggestion,
} from './all-utils'

function queryAllByPlaceholderText(
  container: Element,
  text: Matcher,
  options: MatcherOptions,
) {
  checkContainerType(container)
  return queryAllByAttribute('placeholder', container, text, options)
}
const getMultipleError = (container: Element, text: Matcher) =>
  `Found multiple elements with the placeholder text of: ${text}`
const getMissingError = (container: Element, text: Matcher) =>
  `Unable to find an element with the placeholder text of: ${text}`

const queryAllByPlaceholderTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByPlaceholderText,
  queryAllByPlaceholderText.name,
  'queryAll',
)

const [
  queryByPlaceholderText,
  getAllByPlaceholderText,
  getByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
] = buildQueries(queryAllByPlaceholderText, getMultipleError, getMissingError)

export {
  queryByPlaceholderText,
  queryAllByPlaceholderTextWithSuggestions as queryAllByPlaceholderText,
  getByPlaceholderText,
  getAllByPlaceholderText,
  findAllByPlaceholderText,
  findByPlaceholderText,
}
