import {
  fuzzyMatches,
  matches,
  makeNormalizer,
  getNodeText,
  buildQueries,
  Matcher,
  checkContainerType,
  wrapAllByQueryWithSuggestion,
  MatcherOptions,
} from './all-utils'

const isSvgTitle = (node: Element): node is SVGTitleElement =>
  node.tagName.toLowerCase() === 'title' &&
  node.parentElement?.tagName.toLowerCase() === 'svg'

function queryAllByTitle(
  container: Element,
  title: Matcher,
  {exact = true, collapseWhitespace, trim, normalizer}: MatcherOptions = {},
) {
  checkContainerType(container)
  const matcher = exact ? matches : fuzzyMatches
  const matchNormalizer = makeNormalizer({collapseWhitespace, trim, normalizer})
  return Array.from(container.querySelectorAll('[title], svg > title')).filter(
    node =>
      matcher(node.getAttribute('title'), node, title, matchNormalizer) ||
      (isSvgTitle(node) &&
        matcher(getNodeText(node), node, title, matchNormalizer)),
  )
}

const getMultipleError = (container: Element, title: Matcher) =>
  `Found multiple elements with the title: ${title}.`
const getMissingError = (container: Element, title: Matcher) =>
  `Unable to find an element with the title: ${title}.`

const queryAllByTitleWithSuggestions = wrapAllByQueryWithSuggestion(
  queryAllByTitle,
  queryAllByTitle.name,
  'queryAll',
)

const [
  queryByTitle,
  getAllByTitle,
  getByTitle,
  findAllByTitle,
  findByTitle,
] = buildQueries(queryAllByTitle, getMultipleError, getMissingError)

export {
  queryByTitle,
  queryAllByTitleWithSuggestions as queryAllByTitle,
  getByTitle,
  getAllByTitle,
  findAllByTitle,
  findByTitle,
}
