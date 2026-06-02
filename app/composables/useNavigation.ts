import { buildNav } from '#shared/nav'

// 站点主导航：从 i18n 取标签，header 与 footer 共用同一份路由表（见 shared/nav.ts）。
export function useNavigation() {
  const { t } = useI18n()
  return computed(() => buildNav(t))
}
