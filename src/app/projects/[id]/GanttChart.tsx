'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { GANTT_PATHS, defaultPathIndex } from '@/lib/gantt-data'
import type { ProjectType } from '@/lib/types'

const PX_PER_WK = 22

interface Props {
  projectType: ProjectType
  startDate: string
}

export function GanttChart({ projectType, startDate }: Props) {
  const [pathIdx, setPathIdx] = useState(() => defaultPathIndex(projectType))
  const path = GANTT_PATHS[pathIdx]
  const W = path.weeks

  // Week label → actual calendar date if we have a start date
  function weekLabel(w: number): string {
    if (!startDate) return `W${w + 1}`
    const d = new Date(startDate)
    d.setDate(d.getDate() + w * 7)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">

      {/* Path selector buttons */}
      <div className="bg-[#0f172a] px-4 pt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 flex-wrap">
          {GANTT_PATHS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setPathIdx(i)}
              className={`px-3 py-1.5 rounded-t text-xs font-semibold border-b-2 transition-all ${
                i === pathIdx
                  ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                  : 'bg-[#1e293b] text-slate-400 border-transparent hover:text-white hover:bg-[#334155]'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        {/* Recommended badge */}
        {defaultPathIndex(projectType) === pathIdx && (
          <span className="text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 mb-1 self-start sm:self-auto">
            ✓ Recommended for {projectType}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="bg-[#0f172a] border-t border-[#334155] flex flex-wrap gap-6 px-4 py-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Duration</p>
          <p className="text-sm font-bold text-slate-100">{path.months}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Cost Guide</p>
          <p className="text-sm font-bold text-slate-100">{path.cost}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Key Trades</p>
          <p className="text-xs text-slate-300 truncate">{path.trades}</p>
        </div>
      </div>

      {/* Gantt scroll area */}
      <div className="bg-[#0f172a] overflow-x-auto">
        <div style={{ minWidth: W * PX_PER_WK + 220 }}>

          {/* Header: week labels */}
          <div className="flex sticky top-0 z-10 bg-[#0f172a] border-b border-[#334155]">
            <div className="w-[220px] shrink-0 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Task / Trade
            </div>
            <div className="flex">
              {Array.from({ length: W }, (_, w) => (
                <div
                  key={w}
                  className="text-center shrink-0 py-2"
                  style={{
                    width: PX_PER_WK,
                    fontSize: 8,
                    color: w % 4 === 0 ? '#94a3b8' : '#334155',
                    fontWeight: w % 4 === 0 ? 700 : 400,
                    borderLeft: w % 4 === 0 ? '1px solid #334155' : '1px solid #1e293b',
                  }}
                >
                  {w % 4 === 0 ? weekLabel(w) : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {path.groups.map(group => (
            <div key={group.name}>
              {/* Group header */}
              <div className="flex border-b border-[#1a2742] bg-[#0a1628] min-h-[26px]">
                <div
                  className="w-[220px] shrink-0 px-3 flex items-center"
                  style={{ borderRight: '1px solid #1e293b' }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {group.name}
                  </span>
                </div>
                <div style={{ width: W * PX_PER_WK }} />
              </div>

              {/* Task rows */}
              {group.tasks.map(task => (
                <div
                  key={task.n}
                  className="flex border-b border-[#1a2742] min-h-[30px] hover:bg-white/5"
                >
                  <div
                    className="w-[220px] shrink-0 px-3 flex items-center justify-between gap-1 text-[11px] text-slate-300"
                    style={{ borderRight: '1px solid #1e293b' }}
                  >
                    <span className="truncate">{task.n}</span>
                    <span className="text-[9px] text-slate-600 shrink-0 pl-1">{task.who}</span>
                  </div>
                  <div className="relative flex-1 flex items-center" style={{ width: W * PX_PER_WK }}>
                    <div
                      title={`${task.n} | ${task.who}`}
                      className="absolute flex items-center h-[18px] rounded-sm text-[9px] text-white/80 font-medium overflow-hidden"
                      style={{
                        left: `${(task.s / W) * 100}%`,
                        width: `${((task.e - task.s) / W) * 100}%`,
                        minWidth: 3,
                        backgroundColor: group.color,
                        padding: '0 4px',
                      }}
                    >
                      {task.risk && <span className="mr-1">⚠</span>}
                      {task.n.length <= 20 ? task.n : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#0a1628] border-t border-[#334155] px-4 py-3 flex flex-wrap gap-3">
        {[
          { color: '#374151', label: 'Land / Handover' },
          { color: '#1e40af', label: 'Design' },
          { color: '#166534', label: 'Approvals (DA/BA)' },
          { color: '#7c2d12', label: 'Procurement / Factory' },
          { color: '#6d28d9', label: 'Groundworks' },
          { color: '#5b21b6', label: 'Frame / Install' },
          { color: '#0e7490', label: 'First Fix — Services' },
          { color: '#0f766e', label: 'Internal Works' },
          { color: '#065f46', label: 'Second Fix' },
          { color: '#1a4731', label: 'Finishes' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
        <span className="text-[10px] text-amber-400 ml-2">⚠ = delay risk</span>
      </div>

      {/* Risks */}
      <div className="bg-[#1c1408] border-t border-amber-900/50 px-4 py-3">
        <p className="text-xs font-bold text-amber-500 mb-2">Delay Risks — {path.name}</p>
        <ul className="space-y-1 pl-4 list-disc">
          {path.risks.map((r, i) => (
            <li key={i} className="text-[11px] text-amber-700/90 leading-relaxed">{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
