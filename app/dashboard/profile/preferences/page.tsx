'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'

export default function PreferencesPage() {
    const { user } = useUser()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const [preferences, setPreferences] = useState({
        // Learning Preferences
        study_mode: 'mixed',
        difficulty_level: 'intermediate',
        response_length: 'balanced',
        explanation_style: 'with_examples',

        // AI Behavior
        ai_tone: 'friendly',
        language_mix: 'balanced',
        quiz_frequency: 'weekly',
        reminder_notifications: true,

        // Study Goals
        daily_study_time: 30,
        weekly_quiz_target: 5,
        focus_subjects: [] as string[],

        // Interface
        font_size: 'medium',
        animations_enabled: true,
        compact_mode: false
    })

    useEffect(() => {
        if (user?.id) {
            fetchPreferences()
        }
    }, [user?.id])

    const fetchPreferences = async () => {
        try {
            const response = await fetch(`/api/preferences?userId=${user?.id}`)
            const data = await response.json()
            if (data.preferences) {
                setPreferences(prev => ({ ...prev, ...data.preferences }))
            }
        } catch (error) {
            console.error('Failed to fetch preferences:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        setSaveStatus('idle')

        try {
            const response = await fetch('/api/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user?.id,
                    preferences
                })
            })

            if (!response.ok) throw new Error('Failed to save')

            setSaveStatus('success')
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch (error) {
            console.error('Save error:', error)
            setSaveStatus('error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-8 w-8 text-[var(--accent-primary)] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm text-[var(--text-secondary)]">Loading preferences...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3">
                        ⚙️ Customize Your Experience
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)]">
                        Personalize MentraAI to match your learning style and preferences
                    </p>
                </div>

                {/* Save Status */}
                {saveStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3">
                        <span className="text-xl">✅</span>
                        <p className="text-sm font-medium text-green-500">Preferences saved successfully!</p>
                    </div>
                )}

                {saveStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3">
                        <span className="text-xl">❌</span>
                        <p className="text-sm font-medium text-red-500">Failed to save preferences. Please try again.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Learning Preferences */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">📚 Learning Preferences</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Study Mode</label>
                                <select
                                    value={preferences.study_mode}
                                    onChange={(e) => setPreferences({ ...preferences, study_mode: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)]"
                                >
                                    <option value="visual">Visual (Images & Diagrams)</option>
                                    <option value="audio">Audio (Voice & Sound)</option>
                                    <option value="text">Text (Reading & Writing)</option>
                                    <option value="mixed">Mixed (All Methods)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Difficulty Level</label>
                                <div className="flex gap-2">
                                    {['beginner', 'intermediate', 'advanced'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setPreferences({ ...preferences, difficulty_level: level })}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${preferences.difficulty_level === level
                                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Response Length</label>
                                <div className="flex gap-2">
                                    {['concise', 'balanced', 'detailed'].map(length => (
                                        <button
                                            key={length}
                                            onClick={() => setPreferences({ ...preferences, response_length: length })}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${preferences.response_length === length
                                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {length.charAt(0).toUpperCase() + length.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Explanation Style</label>
                                <select
                                    value={preferences.explanation_style}
                                    onChange={(e) => setPreferences({ ...preferences, explanation_style: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)]"
                                >
                                    <option value="simple">Simple (Easy to understand)</option>
                                    <option value="technical">Technical (Detailed & precise)</option>
                                    <option value="with_examples">With Examples (Practical)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* AI Behavior */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">🤖 AI Behavior</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">AI Tone</label>
                                <select
                                    value={preferences.ai_tone}
                                    onChange={(e) => setPreferences({ ...preferences, ai_tone: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)]"
                                >
                                    <option value="friendly">Friendly & Casual</option>
                                    <option value="professional">Professional</option>
                                    <option value="motivational">Motivational & Encouraging</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Language Mix</label>
                                <div className="flex gap-2">
                                    {['english', 'balanced', 'hindi'].map(mix => (
                                        <button
                                            key={mix}
                                            onClick={() => setPreferences({ ...preferences, language_mix: mix })}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${preferences.language_mix === mix
                                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {mix === 'english' ? 'More English' : mix === 'balanced' ? 'Balanced' : 'More Hindi'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Quiz Frequency</label>
                                <select
                                    value={preferences.quiz_frequency}
                                    onChange={(e) => setPreferences({ ...preferences, quiz_frequency: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)]"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Reminder Notifications</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Get reminders to study</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.reminder_notifications}
                                        onChange={(e) => setPreferences({ ...preferences, reminder_notifications: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Study Goals */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">🎯 Study Goals</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Daily Study Time: {preferences.daily_study_time} minutes
                                </label>
                                <input
                                    type="range"
                                    min="15"
                                    max="180"
                                    step="15"
                                    value={preferences.daily_study_time}
                                    onChange={(e) => setPreferences({ ...preferences, daily_study_time: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-[var(--bg-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                                />
                                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                                    <span>15 min</span>
                                    <span>3 hours</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                    Weekly Quiz Target: {preferences.weekly_quiz_target} quizzes
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={preferences.weekly_quiz_target}
                                    onChange={(e) => setPreferences({ ...preferences, weekly_quiz_target: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-[var(--bg-elevated)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
                                />
                                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                                    <span>1 quiz</span>
                                    <span>20 quizzes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interface */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">🎨 Interface</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Font Size</label>
                                <div className="flex gap-2">
                                    {['small', 'medium', 'large'].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setPreferences({ ...preferences, font_size: size })}
                                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${preferences.font_size === size
                                                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                                }`}
                                        >
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Animations</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Enable smooth animations</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.animations_enabled}
                                        onChange={(e) => setPreferences({ ...preferences, animations_enabled: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Compact Mode</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Reduce spacing and padding</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={preferences.compact_mode}
                                        onChange={(e) => setPreferences({ ...preferences, compact_mode: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="text-lg">💾</span>
                                Save Preferences
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
