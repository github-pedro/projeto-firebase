export const isNullOrUndefined = (value: unknown): boolean => {
  return value == null
}

export const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

export const isEmptyString = (value: unknown): boolean => {
  return String(value).trim() === ''
}

export const isEmpty = (value: unknown): boolean => {
  return isNullOrUndefined(value) || isEmptyString(value) || isEmptyArray(value)
}
