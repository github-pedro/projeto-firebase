import { isEmpty } from '../helpers'

export const email = (value: unknown) => {
  if (isEmpty(value)) return true

  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value)) {
    return value.every(val => pattern.test(String(val)))
  }

  return pattern.test(String(value))
}
