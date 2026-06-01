type ProjectStatus = 'active' | 'wip' | 'archived'

const PROJECT_STATUSES = new Set<ProjectStatus>(['active', 'wip', 'archived'])

export function normalizeProjectStatus(status?: string): ProjectStatus {
  return PROJECT_STATUSES.has(status as ProjectStatus) ? status as ProjectStatus : 'active'
}

export function useProjectStatus() {
  const { t } = useI18n()

  function projectStatusClass(status?: string) {
    const normalized = normalizeProjectStatus(status)

    return {
      'pill--active': normalized === 'active',
      'pill--wip': normalized === 'wip',
      'pill--archived': normalized === 'archived',
    }
  }

  function projectStatusLabel(status?: string) {
    return t(`projects.status.${normalizeProjectStatus(status)}`)
  }

  return {
    projectStatusClass,
    projectStatusLabel,
  }
}
