'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

export default function PrivacyPage() {
    const { user } = useUser()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showClearChatConfirm, setShowClearChatConfirm] = useState(false)

    const handleDownloadData = () => {
        // TODO: Implement data export
        alert('Data export feature coming soon!')
    }

    const handleClearChatHistory = async () => {
        // TODO: Implement clear chat history
        alert('Chat history cleared!')
        setShowClearChatConfirm(false)
    }

    const handleDeleteAccount = async () => {
        // TODO: Implement account deletion
        alert('Account deletion requires email confirmation. Feature coming soon!')
        setShowDeleteConfirm(false)
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3">
                        🔒 Privacy & Security
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)]">
                        Manage your data, privacy settings, and account security
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Data & Privacy */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <span className="text-xl">🛡️</span>
                            Your Data & Privacy
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">What data we collect</h3>
                                <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                                    <li>Account information (email, name)</li>
                                    <li>Chat conversations and quiz responses</li>
                                    <li>Usage analytics and preferences</li>
                                    <li>Study progress and performance data</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-2">How we use your data</h3>
                                <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                                    <li>Personalize your learning experience</li>
                                    <li>Improve AI responses and recommendations</li>
                                    <li>Track your progress and achievements</li>
                                    <li>Provide better support and features</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <h3 className="font-semibold text-green-500 mb-2">✓ We never share your data</h3>
                                <p className="text-sm text-green-500/80">
                                    Your personal information and study data are never sold or shared with third parties.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Management */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <span className="text-xl">📥</span>
                            Data Management
                        </h2>

                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadData}
                                className="w-full p-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg transition-colors text-left flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Download Your Data</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Export all your data in JSON format</p>
                                </div>
                                <span className="text-xl">📥</span>
                            </button>

                            <button
                                onClick={() => setShowClearChatConfirm(true)}
                                className="w-full p-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg transition-colors text-left flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Clear Chat History</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Delete all chat conversations</p>
                                </div>
                                <span className="text-xl">🗑️</span>
                            </button>

                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors text-left flex items-center justify-between group"
                            >
                                <div>
                                    <h3 className="font-semibold text-red-500 mb-1">Delete Account</h3>
                                    <p className="text-sm text-red-500/80">Permanently delete your account and all data</p>
                                </div>
                                <span className="text-xl">⚠️</span>
                            </button>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <span className="text-xl">🔑</span>
                            Security Settings
                        </h2>

                        <div className="space-y-3">
                            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Change Password</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Update your account password</p>
                                </div>
                                <button className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">
                                    Change
                                </button>
                            </div>

                            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Two-Factor Authentication</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Add extra security to your account</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium">
                                    Coming Soon
                                </span>
                            </div>

                            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-[var(--text-primary)]">Active Sessions</h3>
                                    <span className="text-sm text-[var(--text-secondary)]">1 active</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                    <span className="text-base">🕐</span>
                                    <span>Current session • Last active: Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Controls */}
                    <div className="genz-card p-6">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Privacy Controls</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Usage Analytics</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Help us improve MentraAI</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">AI Personalization</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Let AI learn from your interactions</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1">Email Notifications</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">Receive updates and reminders</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[var(--bg-card)] rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Delete Account?</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                This action cannot be undone. All your data, progress, and chat history will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Clear Chat Confirmation Modal */}
                {showClearChatConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-[var(--bg-card)] rounded-xl p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Clear Chat History?</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-4">
                                All your chat conversations will be permanently deleted. This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowClearChatConfirm(false)}
                                    className="flex-1 px-4 py-2 bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleClearChatHistory}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
