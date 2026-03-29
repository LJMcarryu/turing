export function useFormatDate() {
  const { locale } = useI18n()

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return { formatDate }
}
