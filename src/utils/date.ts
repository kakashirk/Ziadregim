export function todayKey(): string {
  const d = new Date()
  return formatDateKey(d)
}

export function formatDateKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function addDays(dateKey: string, delta: number): string {
  const d = new Date(dateKey + 'T12:00:00')
  d.setDate(d.getDate() + delta)
  return formatDateKey(d)
}

export function displayDate(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00')
  const today = todayKey()
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  if (dateKey === today) return "Aujourd'hui"
  if (dateKey === yesterday) return 'Hier'
  if (dateKey === tomorrow) return 'Demain'
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function shortDate(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00')
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
