export interface TeamMember {
  name: string
  initials: string
  color: string
}

// Fallback team list — used to fill in teammates who aren't the logged-in user.
// Add or remove names here as the team grows.
export const TEAM: TeamMember[] = [
  { name: 'Stan Ho',     initials: 'SH', color: '#0F766E' },
  { name: 'Ellie',       initials: 'EL', color: '#7C3AED' },
  { name: 'Sid',         initials: 'SI', color: '#B45309' },
  { name: 'Joseph',      initials: 'JO', color: '#BE123C' },
  { name: 'Noel Bridge', initials: 'NB', color: '#0369A1' },
]

// Colour palette — consistent, readable, distinct
const COLOURS = [
  '#1E3A5F', '#0F766E', '#7C3AED', '#B45309', '#BE123C',
  '#0369A1', '#047857', '#9333EA', '#C2410C', '#0891B2',
  '#065F46', '#1D4ED8', '#6D28D9', '#92400E', '#9F1239',
]

/** Deterministic colour from any string (user ID, name, etc). Same input → same colour always. */
export function stringToColor(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash & 0x7FFFFFFF
  }
  return COLOURS[hash % COLOURS.length]
}

/** Extract up to 2 initials from a full name. */
export function nameToInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/** Build a TeamMember from a Clerk user's name + ID. */
export function clerkUserToMember(fullName: string | null, userId: string): TeamMember {
  const name = fullName?.trim() || 'Me'
  return {
    name,
    initials: nameToInitials(name) || userId.slice(0, 2).toUpperCase(),
    color: stringToColor(userId),
  }
}
