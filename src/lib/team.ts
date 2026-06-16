export interface TeamMember {
  name: string
  initials: string
  color: string
}

export const TEAM: TeamMember[] = [
  { name: 'Ryan Tan',     initials: 'RT', color: '#1E3A5F' },
  { name: 'Stan Ho',      initials: 'SH', color: '#0F766E' },
  { name: 'Ellie',        initials: 'EL', color: '#7C3AED' },
  { name: 'Sid',          initials: 'SI', color: '#B45309' },
  { name: 'Joseph',       initials: 'JO', color: '#BE123C' },
  { name: 'Noel Bridge',  initials: 'NB', color: '#0369A1' },
]

export function getMember(name: string): TeamMember {
  return TEAM.find(m => m.name === name) ?? { name, initials: name.slice(0, 2).toUpperCase(), color: '#64748B' }
}
