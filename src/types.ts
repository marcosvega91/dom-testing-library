export type Callback<T> = () => T

export type Nullish<T> = T | null | undefined

export function isElement(node: Node | Element | HTMLElement): node is Element {
  return (node as Element).matches !== undefined
}

export function isNotNull<T>(arg: T): arg is NonNullable<T> {
  return arg !== null
}
