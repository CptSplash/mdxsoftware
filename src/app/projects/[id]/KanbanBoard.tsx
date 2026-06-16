'use client'

import { useState, useRef } from 'react'
import { Plus, X, Trash2, Calendar } from 'lucide-react'
import { AvatarGroup } from '@/components/ui/avatar-bubble'
import { createTaskCard, moveTaskCard, deleteTaskCard } from '@/lib/supabase/actions'
import { TEAM } from '@/lib/team'
import type { TaskCard, CardColumn, CardPriority, CardAssignee } from '@/lib/types'

const COLUMNS: { id: CardColumn; label: string; color: string }[] = [
  { id: 'Backlog',     label: 'Backlog',     color: '#94A3B8' },
  { id: 'To Do',       label: 'To Do',       color: '#3B82F6' },
  { id: 'In Progress', label: 'In Progress', color: '#F59E0B' },
  { id: 'In Review',   label: 'In Review',   color: '#8B5CF6' },
  { id: 'Done',        label: 'Done',        color: '#10B981' },
]

const PRIORITY_STYLES: Record<CardPriority, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-700',
  High:   'bg-amber-100 text-amber-700',
  Urgent: 'bg-red-100 text-red-700',
}

const PRIORITY_BAR: Record<CardPriority, string> = {
  Low:    '#94A3B8',
  Medium: '#3B82F6',
  High:   '#F59E0B',
  Urgent: '#EF4444',
}

interface AddForm {
  title: string
  description: string
  priority: CardPriority
  dueDate: string
  assignees: CardAssignee[]
}

const BLANK_FORM: AddForm = { title: '', description: '', priority: 'Medium', dueDate: '', assignees: [] }

interface Props {
  projectId: string
  initialCards: TaskCard[]
}

export function KanbanBoard({ projectId, initialCards }: Props) {
  const [cards, setCards] = useState<TaskCard[]>(initialCards)
  const [addingTo, setAddingTo] = useState<CardColumn | null>(null)
  const [form, setForm] = useState<AddForm>(BLANK_FORM)
  const [saving, setSaving] = useState(false)
  const dragCard = useRef<string | null>(null)

  const cardsIn = (col: CardColumn) => cards.filter(c => c.columnName === col)

  // Drag-and-drop
  const onDragStart = (cardId: string) => { dragCard.current = cardId }
  const onDrop = async (col: CardColumn) => {
    const id = dragCard.current
    if (!id) return
    const card = cards.find(c => c.id === id)
    if (!card || card.columnName === col) return
    setCards(prev => prev.map(c => c.id === id ? { ...c, columnName: col } : c))
    await moveTaskCard(id, col, projectId)
    dragCard.current = null
  }

  const toggleAssignee = (member: CardAssignee) => {
    setForm(f => ({
      ...f,
      assignees: f.assignees.find(a => a.name === member.name)
        ? f.assignees.filter(a => a.name !== member.name)
        : [...f.assignees, member],
    }))
  }

  const handleAdd = async (col: CardColumn) => {
    if (!form.title.trim()) return
    setSaving(true)
    const card: TaskCard = {
      id: crypto.randomUUID(),
      projectId, title: form.title.trim(), description: form.description,
      columnName: col, assignees: form.assignees,
      priority: form.priority, dueDate: form.dueDate || null,
      sortOrder: Date.now(), createdAt: new Date().toISOString(),
    }
    setCards(prev => [...prev, card])
    setAddingTo(null)
    setForm(BLANK_FORM)
    await createTaskCard({
      projectId, title: card.title, description: card.description,
      columnName: col, assignees: card.assignees,
      priority: card.priority, dueDate: card.dueDate,
    })
    setSaving(false)
  }

  const handleDelete = async (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId))
    await deleteTaskCard(cardId, projectId)
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[600px]">
      {COLUMNS.map(col => {
        const colCards = cardsIn(col.id)
        const isAdding = addingTo === col.id
        return (
          <div
            key={col.id}
            className="flex-shrink-0 w-64 flex flex-col rounded-xl bg-gray-50 border border-gray-200"
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(col.id)}
          >
            {/* Column header */}
            <div className="px-3 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 font-medium">
                  {colCards.length}
                </span>
              </div>
              <button
                onClick={() => { setAddingTo(col.id); setForm(BLANK_FORM) }}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Cards */}
            <div className="flex-1 px-2 space-y-2 overflow-y-auto">
              {colCards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => onDragStart(card.id)}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: PRIORITY_BAR[card.priority] }} />
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{card.title}</p>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {card.description && (
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">{card.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${PRIORITY_STYLES[card.priority]}`}>
                          {card.priority}
                        </span>
                        {card.dueDate && (
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(card.dueDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <AvatarGroup assignees={card.assignees} />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add card form */}
              {isAdding && (
                <div className="bg-white rounded-lg border-2 border-amber-400 shadow-sm p-3 space-y-2">
                  <input
                    autoFocus
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-amber-400"
                    placeholder="Card title..."
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdd(col.id); if (e.key === 'Escape') setAddingTo(null) }}
                  />
                  <textarea
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-amber-400 resize-none"
                    placeholder="Description (optional)..."
                    rows={2}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  />

                  {/* Priority */}
                  <div className="flex gap-1 flex-wrap">
                    {(['Low','Medium','High','Urgent'] as CardPriority[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setForm(f => ({ ...f, priority: p }))}
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border transition-all ${
                          form.priority === p ? PRIORITY_STYLES[p] + ' border-current' : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Due date */}
                  <input
                    type="date"
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-amber-400"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  />

                  {/* Assignees */}
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-medium">Assign to</p>
                    <div className="flex flex-wrap gap-1">
                      {TEAM.map(member => {
                        const selected = form.assignees.some(a => a.name === member.name)
                        return (
                          <button
                            key={member.name}
                            onClick={() => toggleAssignee(member)}
                            className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border transition-all ${
                              selected ? 'border-current text-white' : 'border-gray-200 text-gray-500 bg-white'
                            }`}
                            style={selected ? { backgroundColor: member.color, borderColor: member.color } : {}}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: member.color, fontSize: '7px' }}
                            >
                              {member.initials}
                            </span>
                            {member.name.split(' ')[0]}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleAdd(col.id)}
                      disabled={!form.title.trim() || saving}
                      className="flex-1 text-xs py-1.5 rounded text-white font-medium disabled:opacity-50"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      Add card
                    </button>
                    <button
                      onClick={() => setAddingTo(null)}
                      className="p-1.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Column footer add button */}
            {!isAdding && (
              <button
                onClick={() => { setAddingTo(col.id); setForm(BLANK_FORM) }}
                className="mx-2 mb-2 mt-1 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 py-1.5 px-2 rounded hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add task
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
