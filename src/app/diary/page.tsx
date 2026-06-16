import { getAllDiary, getProjects } from '@/lib/supabase/queries'

const WEATHER_EMOJI: Record<string, string> = {
  Sunny: '☀️',
  'Partly Cloudy': '⛅',
  Overcast: '☁️',
  Rain: '🌧️',
  Wind: '💨',
  Extreme: '⚡',
}

export default async function DiaryPage() {
  const [allDiary, projects] = await Promise.all([getAllDiary(), getProjects()])

  const activeProjectIds = projects
    .filter(p => p.status === 'Active')
    .map(p => p.id)

  const sorted = allDiary
    .filter(d => activeProjectIds.includes(d.projectId))
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Site Diary</h2>

      <div className="space-y-3">
        {sorted.map(entry => {
          const project = projects.find(p => p.id === entry.projectId)
          const date = new Date(entry.date)
          return (
            <div key={entry.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="flex items-start gap-4">
                {/* Date badge */}
                <div className="text-center min-w-[64px]">
                  <div className="text-white text-xs font-bold rounded-t px-2 py-0.5" style={{ backgroundColor: '#1E3A5F' }}>
                    {date.toLocaleDateString('en-AU', { month: 'short' }).toUpperCase()}
                  </div>
                  <div className="border border-t-0 border-gray-200 rounded-b px-2 py-1">
                    <span className="text-xl font-bold text-gray-900">{date.getDate()}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-sm font-semibold text-[#1E3A5F]">{project?.name}</span>
                    <span className="text-xs text-gray-400">{project?.projectNumber}</span>
                    <span className="text-base">{WEATHER_EMOJI[entry.weather]}</span>
                    <span className="text-xs text-gray-500">{entry.weather}</span>
                    {entry.hasIssues && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Issues</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">{entry.workCompleted}</p>
                  {entry.delays && entry.delays !== 'None' && (
                    <p className="text-sm text-red-600 mt-1"><span className="font-medium">Delays: </span>{entry.delays}</p>
                  )}
                  {entry.visitors && entry.visitors !== 'None' && (
                    <p className="text-sm text-gray-500 mt-1"><span className="font-medium">Visitors: </span>{entry.visitors}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
