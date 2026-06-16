import { Badge } from './badge'

type StatusBadgeVariant = 'green' | 'blue' | 'amber' | 'gray' | 'purple'

const STATUS_VARIANT_MAP: Record<string, StatusBadgeVariant> = {
  // Green
  Active: 'green',
  Paid: 'green',
  Complete: 'green',
  Accepted: 'green',
  'On Site': 'green',
  Available: 'green',
  // Blue
  Tender: 'blue',
  Invited: 'blue',
  Claimed: 'blue',
  Quoted: 'blue',
  'Owner-Builder': 'blue',
  Developer: 'blue',
  // Amber
  'At Risk': 'amber',
  Disputed: 'amber',
  Defects: 'amber',
  Busy: 'amber',
  // Gray
  Closed: 'gray',
  'Do Not Use': 'gray',
  Rejected: 'gray',
  // Purple
  'Practical Completion': 'purple',
  Invoiced: 'purple',
  Scheduled: 'purple',
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status] ?? 'gray'
  return <Badge variant={variant}>{status}</Badge>
}
