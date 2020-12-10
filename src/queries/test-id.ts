import {
  queryAllByAttribute,
  getConfig,
  buildQueries,
  Matcher,
  MatcherOptions,
  wrapAllByQueryWithSuggestion,
  checkContainerType,
} from './all-utils'

const getTestIdAttribute = () => getConfig().testIdAttribute

function queryAllByTestId(
  container: Element,
  id: Matcher,
  options: MatcherOptions,
) {
  checkContainerType(container)
  return queryAllByAttribute(getTestIdAttribute(), container, id, options)
}

const getMultipleError = (container: Element, id: Matcher) =>
  `Found multiple elements by: [${getTestIdAttribute()}="${id}"]`
const getMissingError = (container: Element, id: Matcher) =>
  `Unable to find an element by: [${getTestIdAttribute()}="${id}"]`

const queryAllByTestIdWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByTestId,
  queryAllByTestId.name,
  'queryAll',
)

const [
  queryByTestId,
  getAllByTestId,
  getByTestId,
  findAllByTestId,
  findByTestId,
] = buildQueries(queryAllByTestId, getMultipleError, getMissingError)

export {
  queryByTestId,
  queryAllByTestIdWithSuggestions as queryAllByTestId,
  getByTestId,
  getAllByTestId,
  findAllByTestId,
  findByTestId,
}
