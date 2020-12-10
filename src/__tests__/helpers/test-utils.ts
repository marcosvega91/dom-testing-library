import {getQueriesForElement} from '../../get-queries-for-element'

function render(
  html: string,
  {container = document.createElement('div')}: {container?: Element} = {},
) {
  container.innerHTML = html
  const containerQueries = getQueriesForElement(container)
  function rerender(newHtml: string) {
    return render(newHtml, {container})
  }
  return {container, rerender, ...containerQueries}
}

function renderIntoDocument(html: string) {
  return render(html, {container: document.body})
}

function cleanup() {
  document.body.innerHTML = ''
}

afterEach(cleanup)

export {render, renderIntoDocument, cleanup}
