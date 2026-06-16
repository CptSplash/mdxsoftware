'use client'

import { useState, useTransition } from 'react'
import { Pencil, X } from 'lucide-react'
import { GANTT_PATHS, defaultPathIndex } from '@/lib/gantt-data'
import { upsertGanttTaskOverride } from '@/lib/supabase/actions'
import type { GanttTask, GanttGroup } from '@/lib/gantt-data'
import type { ProjectType, ScheduleMilestone, GanttTaskOverride } from '@/lib/types'

const PX_PER_WK  = 20
const LEFT_W     = 'clamp(260px, 30%, 360px)'   // room for edit button, task name, and trade
const WEEK_H     = 34    // week header row px
const GRP_H      = 28    // group header row px
const TASK_H     = 32    // task row px
const TRACKING_MONTHS = 30
const MIN_WEEKS  = 132   // 30-month tracking window with a little rounding buffer

interface Props {
  projectType: ProjectType
  startDate: string
  projectId: string
  initialMilestones: ScheduleMilestone[]
  initialOverrides: GanttTaskOverride[]
}

interface EditState {
  taskKey: string
  pathId: string
  taskName: string
  who: string
  groupColor: string
  startDate: string
  endDate: string
  notes: string
}

function toISO(date: Date) {
  return date.toISOString().split('T')[0]
}

function addWeeks(isoDate: string, weeks: number): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + weeks * 7)
  return toISO(d)
}

function weeksBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / (7 * 86_400_000))
}

function dateToWeekOffset(isoDate: string, projectStart: string): number {
  return (new Date(isoDate).getTime() - new Date(projectStart).getTime()) / (7 * 86_400_000)
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function GanttChart({ projectType, startDate, projectId, initialMilestones, initialOverrides }: Props) {
  const [pathIdx, setPathIdx]       = useState(() => defaultPathIndex(projectType))
  const [overrides, setOverrides]   = useState<GanttTaskOverride[]>(initialOverrides)
  const [editing, setEditing]       = useState<EditState | null>(null)
  const [pending, startTransition]  = useTransition()

  const path = GANTT_PATHS[pathIdx]
  const W    = Math.max(path.weeks, MIN_WEEKS)

  // Week label (calendar date from project start)
  function weekLabel(w: number): string {
    const d = new Date(startDate)
    d.setDate(d.getDate() + w * 7)
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  }

  // Find override for a task
  function getOverride(taskKey: string): GanttTaskOverride | undefined {
    return overrides.find(o => o.pathId === path.id && o.taskKey === taskKey)
  }

  // Bar position (override or template)
  function barProps(task: GanttTask, taskKey: string): { s: number; e: number; custom: boolean } {
    const ov = getOverride(taskKey)
    if (ov?.startDate && ov?.endDate) {
      return {
        s: dateToWeekOffset(ov.startDate, startDate),
        e: dateToWeekOffset(ov.endDate, startDate),
        custom: true,
      }
    }
    return { s: task.s, e: task.e, custom: false }
  }

  // Open edit modal
  function openEdit(task: GanttTask, group: GanttGroup) {
    const taskKey = `${group.name}::${task.n}`
    const ov = getOverride(taskKey)

    // Default start date: project start + template offset
    const defaultStart = (() => {
      const d = new Date(startDate)
      d.setDate(d.getDate() + task.s * 7)
      return toISO(d)
    })()
    const defaultEnd = (() => {
      const d = new Date(startDate)
      d.setDate(d.getDate() + task.e * 7)
      return toISO(d)
    })()

    setEditing({
      taskKey,
      pathId: path.id,
      taskName: task.n,
      who: task.who,
      groupColor: group.color,
      startDate: ov?.startDate ?? defaultStart,
      endDate:   ov?.endDate   ?? defaultEnd,
      notes:     ov?.notes     ?? '',
    })
  }

  // Save override
  function saveEdit() {
    if (!editing) return
    const { taskKey, pathId, startDate: s, endDate: e, notes } = editing
    startTransition(async () => {
      await upsertGanttTaskOverride({ projectId, pathId, taskKey, startDate: s, endDate: e, notes })
      setOverrides(prev => {
        const hit = prev.find(o => o.pathId === pathId && o.taskKey === taskKey)
        const next: GanttTaskOverride = { id: hit?.id ?? '', projectId, pathId, taskKey, startDate: s, endDate: e, notes }
        return hit ? prev.map(o => o.pathId === pathId && o.taskKey === taskKey ? next : o) : [...prev, next]
      })
      setEditing(null)
    })
  }

  // Clear override (revert to template)
  function clearEdit() {
    if (!editing) return
    const { taskKey, pathId } = editing
    startTransition(async () => {
      await upsertGanttTaskOverride({ projectId, pathId, taskKey, startDate: null, endDate: null, notes: '' })
      setOverrides(prev => prev.filter(o => !(o.pathId === pathId && o.taskKey === taskKey)))
      setEditing(null)
    })
  }

  // Derived duration for modal
  const durationWeeks = editing?.startDate && editing?.endDate
    ? weeksBetween(editing.startDate, editing.endDate)
    : null

  return (
    <>
    {/* Main chart */}
    <div className="w-full rounded-xl border border-gray-200 flex flex-col overflow-hidden">

      {/* Path selector */}
      <div className="bg-[#0f172a] px-4 pt-3 flex items-start gap-3 justify-between flex-wrap">
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
        {defaultPathIndex(projectType) === pathIdx && (
          <span className="shrink-0 text-[10px] font-semibold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 mt-1">
            Recommended for {projectType}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="bg-[#0f172a] border-t border-[#334155] flex flex-wrap gap-6 px-4 py-2 items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Build Duration</p>
          <p className="text-sm font-bold text-slate-100">{path.months}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Tracking Window</p>
          <p className="text-sm font-bold text-slate-100">{TRACKING_MONTHS} months</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Cost Guide</p>
          <p className="text-sm font-bold text-slate-100">{path.cost}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Key Trades</p>
          <p className="text-xs text-slate-300 truncate">{path.trades}</p>
        </div>
        <p className="self-end text-[10px] text-slate-600 italic shrink-0">Use the pencil or double-click a task to edit dates</p>
      </div>

      <div className="flex min-h-0 overflow-hidden" style={{ borderTop: '1px solid #334155' }}>

        {/* Fixed front column */}
        <div
          className="shrink-0 flex flex-col bg-[#0f172a] z-10"
          style={{ width: LEFT_W, borderRight: '1px solid #1e293b' }}
        >
          {/* Header */}
          <div
            className="flex items-center px-3 border-b border-[#334155] shrink-0"
            style={{ height: WEEK_H }}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Edit / Task / Trade</span>
          </div>

          {path.groups.map(group => (
            <div key={group.name} className="shrink-0">
              {/* Group header */}
              <div
                className="flex items-center px-3 bg-[#0a1628] border-b border-[#1a2742]"
                style={{ height: GRP_H, borderLeft: `3px solid ${group.color}` }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{group.name}</span>
              </div>

              {group.tasks.map(task => {
                const taskKey = `${group.name}::${task.n}`
                const hasOverride = !!getOverride(taskKey)?.startDate
                return (
                  <div
                    key={task.n}
                    onDoubleClick={() => openEdit(task, group)}
                    className="flex items-center gap-2 px-2 border-b border-[#1a2742] hover:bg-white/5 cursor-pointer select-none"
                    style={{ height: TASK_H }}
                    title="Double-click to edit dates"
                  >
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        openEdit(task, group)
                      }}
                      className="inline-flex h-6 shrink-0 items-center gap-1 rounded border border-blue-500/60 bg-blue-600/15 px-1.5 text-[10px] font-semibold text-blue-200 hover:border-blue-400 hover:bg-blue-600/25 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Edit task dates"
                      aria-label={`Edit dates for ${task.n}`}
                    >
                      <Pencil className="h-3 w-3" />
                      Edit
                    </button>
                    {hasOverride && (
                      <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" title="Custom dates set" />
                    )}
                    <span className="text-[11px] text-slate-300 truncate flex-1 min-w-0">{task.n}</span>
                    <span className="text-[9px] text-slate-600 shrink-0">{task.who}</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Scrollable timeline */}
        <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden bg-[#0f172a]">
          <div style={{ width: W * PX_PER_WK }}>

            {/* Week header */}
            <div
              className="flex border-b border-[#334155] bg-[#0f172a]"
              style={{ height: WEEK_H }}
            >
              {Array.from({ length: W }, (_, w) => (
                <div
                  key={w}
                  className="shrink-0 flex items-end justify-center pb-1"
                  style={{
                    width: PX_PER_WK,
                    fontSize: 8,
                    color: w % 4 === 0 ? '#94a3b8' : '#1e293b',
                    fontWeight: w % 4 === 0 ? 700 : 400,
                    borderLeft: w % 4 === 0 ? '1px solid #334155' : '1px solid #1e293b',
                  }}
                >
                  {w % 4 === 0 ? weekLabel(w) : ''}
                </div>
              ))}
            </div>

            {/* Task bar rows */}
            {path.groups.map(group => (
              <div key={group.name}>
                {/* Group header row (blank: label is in left col) */}
                <div
                  className="border-b border-[#1a2742] bg-[#0a1628]"
                  style={{ height: GRP_H }}
                />

                {group.tasks.map(task => {
                  const taskKey = `${group.name}::${task.n}`
                  const { s, e, custom } = barProps(task, taskKey)
                  const leftPct  = (s / W) * 100
                  const widthPct = Math.max(0, ((e - s) / W) * 100)

                  return (
                    <div
                      key={task.n}
                      onDoubleClick={() => openEdit(task, group)}
                      className="relative border-b border-[#1a2742] hover:bg-white/5 cursor-pointer"
                      style={{ height: TASK_H }}
                      title="Double-click to edit dates"
                    >
                      <div
                        className="absolute flex items-center rounded-sm text-[9px] text-white/90 font-medium overflow-hidden"
                        style={{
                          left:   `${leftPct}%`,
                          width:  `${widthPct}%`,
                          top: '50%', transform: 'translateY(-50%)',
                          height: 18, minWidth: 4,
                          backgroundColor: group.color,
                          padding: '0 5px',
                          // Custom overrides get a white top border to distinguish them
                          boxShadow: custom ? 'inset 0 2px 0 rgba(255,255,255,0.35)' : undefined,
                        }}
                      >
                        {task.risk && !custom && <span className="mr-1">!</span>}
                        {task.n.length <= 20 ? task.n : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-[#0a1628] border-t border-[#334155] px-4 py-3 flex flex-wrap gap-3 items-center">
        {[
          { color: '#374151', label: 'Land / Handover' },
          { color: '#1e40af', label: 'Design' },
          { color: '#166534', label: 'Approvals' },
          { color: '#7c2d12', label: 'Procurement' },
          { color: '#6d28d9', label: 'Groundworks' },
          { color: '#5b21b6', label: 'Frame / Install' },
          { color: '#0e7490', label: 'First Fix' },
          { color: '#0f766e', label: 'Internal Works' },
          { color: '#065f46', label: 'Second Fix' },
          { color: '#1a4731', label: 'Finishes' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: l.color }} />
            {l.label}
          </div>
        ))}
        <span className="text-[10px] text-amber-400">! = delay risk</span>
        <span className="text-[10px] text-slate-500 ml-auto flex items-center gap-1">
          <span className="inline-block w-3 h-2 rounded-sm" style={{ background: '#334155', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35)' }} />
          = custom dates
        </span>
      </div>

      {/* Risks */}
      <div className="bg-[#1c1408] border-t border-amber-900/50 px-4 py-3">
        <p className="text-xs font-bold text-amber-500 mb-2">Delay Risks - {path.name}</p>
        <ul className="space-y-1 pl-4 list-disc">
          {path.risks.map((r, i) => (
            <li key={i} className="text-[11px] text-amber-700/90 leading-relaxed">{r}</li>
          ))}
        </ul>
      </div>
    </div>

    {/* Edit modal */}
    {editing && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}
      >
        <div className="bg-[#0f172a] border border-[#334155] rounded-2xl shadow-2xl w-[420px] max-w-[95vw] overflow-hidden">

          {/* Modal header */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '2px solid', borderColor: editing.groupColor }}
          >
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Edit Task</p>
              <p className="text-sm font-bold text-slate-100 mt-0.5">{editing.taskName}</p>
              <p className="text-[11px] text-slate-500">Responsible: {editing.who}</p>
            </div>
            <button
              onClick={() => setEditing(null)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal body */}
          <div className="px-5 py-4 space-y-4">

            {/* Start date */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={editing.startDate}
                onChange={e => {
                  const s = e.target.value
                  // Keep same duration when start changes
                  const dur = durationWeeks ?? 4
                  setEditing(prev => prev ? { ...prev, startDate: s, endDate: addWeeks(s, dur) } : null)
                }}
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Duration (weeks)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={260}
                  value={durationWeeks ?? ''}
                  onChange={e => {
                    const w = parseInt(e.target.value)
                    if (!isNaN(w) && w > 0 && editing.startDate) {
                      setEditing(prev => prev ? { ...prev, endDate: addWeeks(prev.startDate, w) } : null)
                    }
                  }}
                  className="w-24 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                />
                {durationWeeks !== null && editing.endDate && (
                  <span className="text-[11px] text-slate-400">
                    {'->'} ends {fmtDate(editing.endDate)}
                  </span>
                )}
              </div>
            </div>

            {/* End date */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={editing.endDate}
                onChange={e => setEditing(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Notes
              </label>
              <textarea
                rows={2}
                value={editing.notes}
                onChange={e => setEditing(prev => prev ? { ...prev, notes: e.target.value } : null)}
                placeholder="e.g. DA lodged, awaiting council response..."
                className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 resize-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Modal footer */}
          <div className="px-5 py-3 border-t border-[#1e293b] flex items-center justify-between">
            <button
              onClick={clearEdit}
              disabled={pending}
              className="text-[11px] text-slate-500 hover:text-red-400 disabled:opacity-50 transition-colors"
            >
              Reset to template
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-1.5 rounded-lg text-sm text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={pending || !editing.startDate || !editing.endDate}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors"
              >
                {pending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
