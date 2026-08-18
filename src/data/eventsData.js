/**
 * src/data/eventsData.js
 * Named exports for the events dataset.
 * Import from HERE in all components — not from events.js directly.
 */
import eventsRaw from './events.js'

export const events = eventsRaw

// All distinct types
export const allEventTypes = [
  'All',
  ...[...new Set(eventsRaw.map(e => e.type).filter(Boolean))].sort(),
]

// All distinct scopes (Global Event / Community Event)
export const allEventScopes = [
  'All',
  ...[...new Set(eventsRaw.map(e => e.eventScope).filter(Boolean))].sort(),
]

// Statuses in logical display order
export const allEventStatuses = [
  'All',
  'ongoing',
  'applications-open',
  'upcoming',
  'completed',
]
