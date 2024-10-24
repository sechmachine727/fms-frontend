import { addHours, format, parseISO } from 'date-fns'

export const convertToVietnamTime = (dateString) => {
  const date = parseISO(format(dateString, 'yyyy-MM-dd'))
  const dateWithTimezone = addHours(date, 7)
  return format(dateWithTimezone, "yy-MM-dd")
}

export const convertToVietnamTimeWithTimeZone = (dateString) => {
  const date = parseISO(format(dateString, 'yyyy-MM-dd'))
  const dateWithTimezone = addHours(date, 7)
  return format(dateWithTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSS")
}
export const parseDateFromString = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}
