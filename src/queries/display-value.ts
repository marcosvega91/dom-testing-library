import {
  getNodeText,
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
  wrapAllByQueryWithSuggestion,
  MatcherOptions,
  checkContainerType,
  Matcher,
} from './all-utils'

function queryAllByDisplayValue(
  container: Element,
  value: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll(`input,textarea,select`)).filter(
    node => {
      if (node.tagName === 'SELECT') {
        const selectElement = node as HTMLSelectElement
        const selectedOptions = Array.from(selectElement.options).filter(
          option => option.selected,
        )
        return selectedOptions.some(optionNode =>
          matcher(getNodeText(optionNode), optionNode, value, matchNormalizer),
        )
      } else {
        const textElement = node as HTMLTextAreaElement & HTMLInputElement
        return matcher(textElement.value, textElement, value, matchNormalizer)
      }
    },
  )
}

const getMultipleError = (container: Element, value: Matcher) =>
  `Found multiple elements with the display value: ${value}.`
const getMissingError = (container: Element, value: Matcher) =>
  `Unable to find an element with the display value: ${value}.`

const queryAllByDisplayValueWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByDisplayValue,
  queryAllByDisplayValue.name,
  'queryAll',
)

const [
  queryByDisplayValue,
  getAllByDisplayValue,
  getByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
] = buildQueries(queryAllByDisplayValue, getMultipleError, getMissingError)

export {
  queryByDisplayValue,
  queryAllByDisplayValueWithSuggestions as queryAllByDisplayValue,
  getByDisplayValue,
  getAllByDisplayValue,
  findAllByDisplayValue,
  findByDisplayValue,
}
