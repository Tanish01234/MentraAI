'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useUser } from '@/contexts/UserContext'
import { getAllHistory, deleteSession, deleteAllHistoryByModule, type HistoryItem, type ModuleType } from '@/lib/utils/history'

export default function ProfileHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filterModule, setFilterModule] = useState<ModuleType | 'all'>('all')
    const [expandedItem, setExpandedItem] = useState<string | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState(false)
    const { user } = useUser()

    useEffect(() => {
        if (user) {
            loadHistory()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, filterModule])

    const loadHistory = async () => {
        if (!user) return
        setLoading(true)
        try {
            const moduleType = filterModule === 'all' ? undefined : filterModule
            const items = await getAllHistory(supabase, user.id, moduleType)
            setHistory(items)
        } catch (error) {
            console.error('Error loading history:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteItem = async (sessionId: string) => {
        if (!confirm('Delete this item? This action cannot be undone.')) {
            return
        }

        if (!user) return

        const success = await deleteSession(supabase, user.id, sessionId)
        if (success) {
            setHistory(prev => prev.filter(item => item.session_id !== sessionId))
        } else {
            alert('Failed to delete item. Please try again.')
        }
    }

    const handleClearModule = async (moduleType: ModuleType) => {
        if (!confirm(`Delete ALL ${moduleType} history? This action cannot be undone.`)) {
            return
        }

        if (!user) return

        const success = await deleteAllHistoryByModule(supabase, user.id, moduleType)
        if (success) {
            setHistory(prev => prev.filter(item => item.module_type !== moduleType))
            setSelectedItems([])
            setSelectAll(false)
        } else {
            alert('Failed to clear history. Please try again.')
        }
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([])
            setSelectAll(false)
        } else {
            setSelectedItems(history.map(item => item.session_id))
            setSelectAll(true)
        }
    }

    const handleToggleSelect = (sessionId: string) => {
        setSelectedItems(prev => {
            if (prev.includes(sessionId)) {
                const newSelected = prev.filter(id => id !== sessionId)
                setSelectAll(newSelected.length === history.length && history.length > 0)
                return newSelected
            } else {
                const newSelected = [...prev, sessionId]
                setSelectAll(newSelected.length === history.length)
                return newSelected
            }
        })
    }

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return

        if (!confirm(`Delete ${selectedItems.length} selected item(s)? This action cannot be undone.`)) {
            return
        }

        if (!user) return

        // Delete all selected items
        const deletePromises = selectedItems.map(sessionId =>
            deleteSession(supabase, user.id, sessionId)
        )

        const results = await Promise.all(deletePromises)
        const allSuccess = results.every(result => result)

        if (allSuccess) {
            setHistory(prev => prev.filter(item => !selectedItems.includes(item.session_id)))
            setSelectedItems([])
            setSelectAll(false)
        } else {
            alert('Some items failed to delete. Please try again.')
        }
    }

    const handleResetAllHistory = async () => {
        if (!confirm('🔥 DELETE ALL HISTORY PERMANENTLY? This will remove all your interactions across all modules and CANNOT be undone!')) {
            return
        }

        // Double confirmation for safety
        if (!confirm('Are you absolutely sure? This is your last chance to cancel.')) {
            return
        }

        if (!user) return

        // Delete all history for all modules
        const modules: ModuleType[] = ['chat', 'notes', 'career', 'exam_planner', 'confusion']
        const deletePromises = modules.map(module =>
            deleteAllHistoryByModule(supabase, user.id, module)
        )

        const results = await Promise.all(deletePromises)
        const allSuccess = results.every(result => result)

        if (allSuccess) {
            setHistory([])
            setSelectedItems([])
            setSelectAll(false)
            alert('✅ All history has been permanently deleted.')
        } else {
            alert('Failed to delete all history. Please try again.')
        }
    }

    const getModuleBadge = (type: ModuleType) => {
        const badges = {
            chat: { icon: '💬', label: 'Chat', color: 'from-blue-500 to-purple-500' },
            quiz: { icon: '🎯', label: 'Quiz', color: 'from-purple-500 to-pink-500' },
            notes: { icon: '📝', label: 'Notes', color: 'from-green-500 to-teal-500' },
            career: { icon: '💼', label: 'Career', color: 'from-orange-500 to-red-500' },
            exam_planner: { icon: '📅', label: 'Exam', color: 'from-pink-500 to-rose-500' },
            confusion: { icon: '💡', label: 'Confusion', color: 'from-yellow-500 to-amber-500' }
        }
        return badges[type] || badges.chat
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const modules: Array<{ value: ModuleType | 'all', label: string, icon: string }> = [
        { value: 'all', label: 'All', icon: '📚' },
        { value: 'chat', label: 'Chat', icon: '💬' },
        { value: 'quiz', label: 'Quizzes', icon: '🎯' },
        { value: 'notes', label: 'Notes', icon: '📝' },
        { value: 'career', label: 'Career', icon: '💼' },
        { value: 'exam_planner', label: 'Exam', icon: '📅' },
        { value: 'confusion', label: 'Confusion', icon: '💡' }
    ]

    const renderContentPreview = (item: HistoryItem) => {
        const content = item.content || {}

        // Helper to render Markdown-like content safely
        const renderText = (text: string) => (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)] font-normal opacity-90">
                {text}
            </div>
        )

        switch (item.module_type) {
            case 'chat':
            case 'confusion':
                return (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {Array.isArray(content.messages) && content.messages.map((m: any, i: number) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[90%] rounded-xl p-3 text-sm ${m.role === 'user'
                                    ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-tr-none'
                                    : 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--text-primary)] rounded-tl-none'
                                    }`}>
                                    <div className="text-[10px] uppercase tracking-wider font-bold mb-1 opacity-50">
                                        {m.role === 'user' ? 'You' : 'Mentra AI'}
                                    </div>
                                    {renderText(m.content)}
                                    {/* Show specialized cards if present */}
                                    {m.type === 'concept' && m.conceptData && (
                                        <div className="mt-2 p-2 bg-black/20 rounded border border-white/10">
                                            <div className="font-bold text-[var(--accent-secondary)]">Concept: {m.conceptData.concept}</div>
                                            <div className="text-xs mt-1">Takeaway: {m.conceptData.takeaway}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )

            case 'notes':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 text-xs">
                            {content.file && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 flex items-center gap-1">
                                    📄 {content.file.name}
                                </span>
                            )}
                        </div>
                        {content.input && !content.file && (
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg text-sm text-[var(--text-secondary)] italic border-l-2 border-[var(--text-muted)]">
                                "{content.input.substring(0, 150)}{content.input.length > 150 ? '...' : ''}"
                            </div>
                        )}
                        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
                            <h4 className="text-xs font-bold uppercase text-[var(--accent-primary)] mb-2 flex items-center gap-2">
                                <span>💡</span> Explanation
                            </h4>
                            {renderText(content.explanation)}
                        </div>
                    </div>
                )

            case 'career':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-xs block mb-1">Education</span>
                                {content.input?.currentEducation}
                            </div>
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-xs block mb-1">Interests</span>
                                {content.input?.interests}
                            </div>
                        </div>
                        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
                            <h4 className="text-xs font-bold uppercase text-[var(--accent-primary)] mb-2 flex items-center gap-2">
                                <span>🎯</span> Career Roadmap
                            </h4>
                            {renderText(content.roadmap)}
                        </div>
                    </div>
                )

            case 'exam_planner':
                const handleDownloadPDF = () => {
                    // Create PDF content
                    const pdfContent = `
STUDY PLAN FOR ${content.input?.examName || 'Exam'}

Exam Date: ${content.input?.examDate || 'N/A'}
Subjects: ${content.input?.subjects || 'N/A'}
Daily Study Hours: ${content.input?.dailyHours || 'N/A'} hours

${content.plan || 'No plan available'}
                    `.trim()

                    // Create blob and download
                    const blob = new Blob([pdfContent], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `study-plan-${content.input?.examName?.replace(/\s+/g, '-') || 'exam'}.txt`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                }

                return (
                    <div className="space-y-4">
                        {/* Exam Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-xs block mb-1">📅 Exam Date</span>
                                <span className="text-[var(--text-primary)] font-semibold">{content.input?.examDate || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-xs block mb-1">📚 Subjects</span>
                                <span className="text-[var(--text-primary)] font-semibold">{content.input?.subjects || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                                <span className="text-[var(--text-muted)] text-xs block mb-1">⏰ Daily Hours</span>
                                <span className="text-[var(--text-primary)] font-semibold">{content.input?.dailyHours || 'N/A'} hours</span>
                            </div>
                        </div>

                        {/* Study Plan Content */}
                        <div className="bg-[var(--bg-surface)] p-4 rounded-xl border border-[var(--border-subtle)]">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold uppercase text-[var(--accent-secondary)] flex items-center gap-2">
                                    <span>📅</span> Study Plan
                                </h4>
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-3 py-1.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-1"
                                >
                                    <span>📄</span> Save as PDF
                                </button>
                            </div>
                            {renderText(content.plan)}
                        </div>
                    </div>
                )

            case 'quiz':
                return (
                    <div className="space-y-4">
                        {/* Quiz Header */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-[var(--text-primary)]">
                                📝 {content.examName || 'Quiz'}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${parseFloat(content.percentage) >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                parseFloat(content.percentage) >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                {content.score}/{content.total} ({content.percentage}%)
                            </span>
                        </div>

                        {/* Subjects */}
                        {content.subjects && content.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {content.subjects.map((subject: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Subject-wise scores */}
                        {content.sections && content.sections.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-3">
                                    Subject-wise Performance
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {content.sections.map((section: any, idx: number) => {
                                        const percentage = (section.correct / section.total * 100).toFixed(0)
                                        return (
                                            <div key={idx} className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-subtle)]">
                                                <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                                                    {section.subject}
                                                </div>
                                                <div className="text-2xl font-bold text-[var(--accent-primary)] mb-2">
                                                    {section.correct}/{section.total}
                                                </div>
                                                <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full"
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-[var(--text-secondary)] mt-1">{percentage}% Correct</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Expand to see questions */}
                        {expandedItem === item.session_id && content.questions && (
                            <div className="mt-4 space-y-3">
                                <h4 className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">
                                    All Questions & Answers
                                </h4>
                                {content.questions.map((q: any, idx: number) => {
                                    const userAnswer = content.userAnswers?.[idx]
                                    const isCorrect = userAnswer === q.correctIndex
                                    return (
                                        <div key={idx} className={`p-3 rounded-lg border ${isCorrect
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-red-500/10 border-red-500/30'
                                            }`}>
                                            <div className="flex items-start gap-2 mb-2">
                                                <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-[var(--text-primary)] mb-2">
                                                        Q{idx + 1}. {q.question}
                                                    </p>
                                                    <div className="space-y-1">
                                                        {q.options.map((opt: string, optIdx: number) => (
                                                            <div
                                                                key={optIdx}
                                                                className={`text-sm px-2 py-1 rounded ${optIdx === q.correctIndex
                                                                    ? 'bg-green-500/20 text-green-300 font-semibold'
                                                                    : optIdx === userAnswer && !isCorrect
                                                                        ? 'bg-red-500/20 text-red-300'
                                                                        : 'text-[var(--text-secondary)]'
                                                                    }`}
                                                            >
                                                                {opt} {optIdx === q.correctIndex && '(Correct)'}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {q.explanation && (
                                                        <p className="text-xs text-[var(--text-secondary)] mt-2 italic">
                                                            💡 {q.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Toggle expand button */}
                        {content.questions && content.questions.length > 0 && (
                            <button
                                onClick={() => setExpandedItem(expandedItem === item.session_id ? null : item.session_id)}
                                className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-semibold"
                            >
                                {expandedItem === item.session_id ? '▲ Hide Questions' : '▼ View All Questions & Answers'}
                            </button>
                        )}
                    </div>
                )

            default:
                return (
                    <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap font-mono p-2">
                        {JSON.stringify(content, null, 2)}
                    </pre>
                )
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="genz-card p-6 animate-fade-in">
                {/* Header */}
                <div className="border-b border-[var(--border-subtle)] pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Your History</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                        All your interactions across MentraAI modules
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {modules.map((module) => (
                        <button
                            key={module.value}
                            onClick={() => setFilterModule(module.value)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterModule === module.value
                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,107,157,0.1)]'
                                }`}
                        >
                            <span className="mr-2">{module.icon}</span>
                            {module.label}
                        </button>
                    ))}
                </div>

                {/* Bulk Action Controls */}
                {history.length > 0 && (
                    <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer"
                            />
                            <span className="text-sm text-white/80">
                                {selectedItems.length > 0
                                    ? `${selectedItems.length} selected`
                                    : 'Select All'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDeleteSelected}
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Selected
                            </button>
                            <button
                                onClick={handleResetAllHistory}
                                className="px-4 py-2 rounded-lg text-xs font-medium bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-all duration-200 flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                🔥 Reset All History
                            </button>
                        </div>
                    </div>
                )}

                {/* Clear Module Button */}
                {filterModule !== 'all' && history.length > 0 && (
                    <div className="mb-4">
                        <button
                            onClick={() => handleClearModule(filterModule as ModuleType)}
                            className="text-sm text-red-600 dark:text-red-400 hover:underline"
                        >
                            Clear all {filterModule} history
                        </button>
                    </div>
                )}

                {/* History List */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No history yet</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Start using MentraAI to build your learning history
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => {
                            const badge = getModuleBadge(item.module_type)
                            const isExpanded = expandedItem === item.id
                            const isSelected = selectedItems.includes(item.session_id)

                            return (
                                <div
                                    key={item.id}
                                    className={`genz-card p-4 hover:shadow-lg transition-all duration-200 animate-slide-up ${isSelected ? 'ring-2 ring-[var(--accent-primary)]' : ''}`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Checkbox */}
                                        <div className="flex-shrink-0 pt-1">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleToggleSelect(item.session_id)}
                                                className="w-4 h-4 rounded border-white/20 bg-white/10 text-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 cursor-pointer"
                                            />
                                        </div>

                                        {/* Module Badge */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl shadow-md`}>
                                            {badge.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                                                        {item.title || 'Untitled'}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                                        <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${badge.color} text-white font-medium`}>
                                                            {badge.label}
                                                        </span>
                                                        <span>{formatDate(item.created_at)}</span>
                                                        {item.created_at !== item.updated_at && (
                                                            <span className="text-[var(--accent-primary)]">• Updated {formatDate(item.updated_at)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                                                        className="p-2 rounded-lg hover:bg-[rgba(255,107,157,0.1)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                                        title={isExpanded ? 'Collapse' : 'Expand'}
                                                    >
                                                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.session_id)}
                                                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Content Preview */}
                                            {isExpanded && (
                                                <div className="mt-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] animate-fade-in">
                                                    {renderContentPreview(item)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Stats */}
                {!loading && history.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                        <p className="text-sm text-[var(--text-muted)] text-center">
                            Showing {history.length} {history.length === 1 ? 'item' : 'items'}
                            {filterModule !== 'all' && ` in ${filterModule}`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
