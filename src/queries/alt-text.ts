import {
  matches,
  fuzzyMatches,
  makeNormalizer,
  buildQueries,
  Matcher,
  MatcherOptions,
  wrapAllByQueryWithSuggestion,
  checkContainerType,
} from './all-utils'

function queryAllByAltText(
  container: Element,
  alt: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('img,input,area')).filter(node =>
    matcher(node.getAttribute('alt'), node, alt, matchNormalizer),
  )
}

const getMultipleError = (container: Element, alt: Matcher) =>
  `Found multiple elements with the alt text: ${alt}`
const getMissingError = (container: Element, alt: Matcher) =>
  `Unable to find an element with the alt text: ${alt}`

const queryAllByAltTextWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByAltText,
  queryAllByAltText.name,
  'queryAll',
)
const [
  queryByAltText,
  getAllByAltText,
  getByAltText,
  findAllByAltText,
  findByAltText,
] = buildQueries(queryAllByAltText, getMultipleError, getMissingError)

export {
  queryByAltText,
  queryAllByAltTextWithSuggestions as queryAllByAltText,
  getByAltText,
  getAllByAltText,
  findAllByAltText,
  findByAltText,
}
