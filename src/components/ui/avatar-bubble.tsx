interface Props {
  initials: string
  color: string
  name?: string
  size?: 'sm' | 'md'
}

export function AvatarBubble({ initials, color, name, size = 'sm' }: Props) {
  const dim = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white shrink-0`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  )
}

export function AvatarGroup({ assignees }: { assignees: { initials: string; color: string; name: string }[] }) {
  if (!assignees.length) return null
  return (
    <div className="flex -space-x-1.5">
      {assignees.slice(0, 4).map((a, i) => (
        <AvatarBubble key={i} initials={a.initials} color={a.color} name={a.name} size="sm" />
      ))}
      {assignees.length > 4 && (
        <div className="w-6 h-6 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-[10px] text-gray-600 font-bold">
          +{assignees.length - 4}
        </div>
      )}
    </div>
  )
}
