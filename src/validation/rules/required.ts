import { isEmptyArray, isEmptyString, isNullOrUndefined } from '../helpers'

export const required = (value: unknown) => {
  return !isNullOrUndefined(value) && !isEmptyArray(value) && !isEmptyString(value) && value !== false
}
