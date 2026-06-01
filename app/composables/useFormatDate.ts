const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function parseDateInput(dateStr: string): Date {
  const dateOnly = DATE_ONLY_PATTERN.exec(dateStr)
  if (!dateOnly)
    return new Date(dateStr)

  const [, year, month, day] = dateOnly
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export function formatDateValue(dateStr: string, locale: string): string {
  const date = parseDateInput(dateStr)
  if (Number.isNaN(date.getTime()))
    return 'Invalid Date'

  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function useFormatDate() {
  const { locale } = useI18n()

  const formatDate = (dateStr: string): string => {
    return formatDateValue(dateStr, locale.value)
  }

  return { formatDate }
}
