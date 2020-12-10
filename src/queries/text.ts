import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
  SelectorMatcherOptions,
  DEFAULT_IGNORE_TAGS,
  checkContainerType,
  wrapAllByQueryWithSuggestion,
  Matcher,
} from './all-utils'

export interface ByTextOptions extends SelectorMatcherOptions {
  ignore?: string
}

function queryAllByText(
  container: Element,
  text: Matcher,
  {
    selector = '*',
    exact = true,
    collapseWhitespace,
    trim,
    ignore = DEFAULT_IGNORE_TAGS,
    normalizer,
  }: ByTextOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  let baseArray: Element[] = []
  if (typeof container.matches === 'function' && container.matches(selector)) {
    baseArray = [container]
  }
  return [...baseArray, ...Array.from(container.querySelectorAll(selector))]
    .filter(node => !ignore || !node.matches(ignore))
    .filter(node => matcher(getNodeText(node), node, text, matchNormalizer))
}

const getMultipleError = (container: Element, text: Matcher) =>
  `Found multiple elements with the text: ${text}`
const getMissingError = (container: Element, text: Matcher) =>
  `Unable to find an element with the text: ${text}. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.`

const queryAllByTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByText,
  queryAllByText.name,
  'queryAll',
)

const [
  queryByText,
  getAllByText,
  getByText,
  findAllByText,
  findByText,
] = buildQueries(queryAllByText, getMultipleError, getMissingError)

export {
  queryByText,
  queryAllByTextWithSuggestions as queryAllByText,
  getByText,
  getAllByText,
  findAllByText,
  findByText,
}
