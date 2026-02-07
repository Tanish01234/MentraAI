'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

interface FAQItem {
    question: string
    answer: string
    category: string
}

const faqs: FAQItem[] = [
    {
        category: 'Account & Login',
        question: 'How do I create an account?',
        answer: 'Click on the "Sign Up" button on the login page. Enter your email and create a password. You\'ll receive a confirmation email to verify your account.'
    },
    {
        category: 'Account & Login',
        question: 'I forgot my password. How do I reset it?',
        answer: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link.'
    },
    {
        category: 'Chat & AI',
        question: 'How do I ask questions to the AI?',
        answer: 'Simply type your question in the chat box and press Enter or click the send button. You can ask about any subject, request explanations, or get help with homework.'
    },
    {
        category: 'Chat & AI',
        question: 'Can I change the language?',
        answer: 'Yes! Click on the language selector in the navbar. You can choose between English, Hinglish, or Gujarati.'
    },
    {
        category: 'Quiz & Exams',
        question: 'How do I create a custom quiz?',
        answer: 'Go to the Quiz page, enter a topic, select difficulty level, and click "Start Quiz". The AI will generate questions for you.'
    },
    {
        category: 'Quiz & Exams',
        question: 'How does the leaderboard work?',
        answer: 'The leaderboard ranks users based on their weekly quiz scores. Complete more quizzes and score higher to climb the ranks!'
    },
    {
        category: 'Technical Issues',
        question: 'The app is loading slowly. What should I do?',
        answer: 'Try refreshing the page, clearing your browser cache, or checking your internet connection. If the issue persists, contact support.'
    },
    {
        category: 'Technical Issues',
        question: 'Which browsers are supported?',
        answer: 'MentraAI works best on Chrome, Firefox, Safari, and Edge (latest versions). Make sure JavaScript is enabled.'
    }
]

export default function SupportPage() {
    const { user, firstName } = useUser()
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // Contact form state
    const [formData, setFormData] = useState({
        name: firstName || '',
        email: user?.email || '',
        subject: '',
        category: 'general',
        message: '',
        priority: 'medium'
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const categories = ['all', ...Array.from(new Set(faqs.map(faq => faq.category)))]
    const filteredFAQs = selectedCategory === 'all'
        ? faqs
        : faqs.filter(faq => faq.category === selectedCategory)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setSubmitStatus('idle')

        try {
            const response = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    user_id: user?.id
                })
            })

            if (!response.ok) {
                throw new Error('Failed to submit')
            }

            setSubmitStatus('success')
            setFormData({
                name: firstName || '',
                email: user?.email || '',
                subject: '',
                category: 'general',
                message: '',
                priority: 'medium'
            })

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitStatus('idle'), 5000)
        } catch (error) {
            console.error('Support submission error:', error)
            setSubmitStatus('error')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-36 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3">
                        ❓ Help & Support
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)]">
                        Get help with MentraAI, find answers to common questions, or contact our support team
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* FAQ Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quick Help Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="genz-card p-4 text-center hover:border-[var(--accent-primary)] transition-colors cursor-pointer">
                                <div className="text-3xl mb-2">📚</div>
                                <h3 className="font-semibold text-[var(--text-primary)] text-sm">Getting Started</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Learn the basics</p>
                            </div>
                            <div className="genz-card p-4 text-center hover:border-[var(--accent-primary)] transition-colors cursor-pointer">
                                <div className="text-3xl mb-2">🎥</div>
                                <h3 className="font-semibold text-[var(--text-primary)] text-sm">Video Tutorials</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Watch and learn</p>
                            </div>
                            <div className="genz-card p-4 text-center hover:border-[var(--accent-primary)] transition-colors cursor-pointer">
                                <div className="text-3xl mb-2">🚀</div>
                                <h3 className="font-semibold text-[var(--text-primary)] text-sm">Feature Tour</h3>
                                <p className="text-xs text-[var(--text-secondary)] mt-1">Explore features</p>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="genz-card p-6">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                                Frequently Asked Questions
                            </h2>

                            {/* Category Filter */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                            ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white'
                                            : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                            }`}
                                    >
                                        {cat === 'all' ? 'All' : cat}
                                    </button>
                                ))}
                            </div>

                            {/* FAQ List */}
                            <div className="space-y-3">
                                {filteredFAQs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border border-[var(--border-subtle)] rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-[var(--bg-elevated)] transition-colors"
                                        >
                                            <span className="text-left font-medium text-[var(--text-primary)] text-sm">
                                                {faq.question}
                                            </span>
                                            {expandedFAQ === index ? (
                                                <svg className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            )}
                                        </button>
                                        {expandedFAQ === index && (
                                            <div className="px-4 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-subtle)]">
                                                <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            {/* Contact Form Card */}
                            <div className="p-6 rounded-3xl border border-[var(--border-subtle)] bg-black/70 backdrop-blur-xl shadow-2xl">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                        <span className="text-2xl">📧</span>
                                        Contact Us
                                    </h2>
                                    <p className="text-xs text-[var(--text-secondary)]">
                                        We'll get back to you within 24 hours
                                    </p>
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-start gap-3 animate-fade-in">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-semibold text-green-500">Message sent successfully!</p>
                                            <p className="text-xs text-green-500/80 mt-1">We'll get back to you soon.</p>
                                        </div>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-fade-in">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-semibold text-red-500">Failed to send message</p>
                                            <p className="text-xs text-red-500/80 mt-1">Please try again later.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)] text-sm transition-all"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)] text-sm transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)] text-sm transition-all"
                                        >
                                            <option value="general">💬 General Inquiry</option>
                                            <option value="technical">🔧 Technical Issue</option>
                                            <option value="feature">✨ Feature Request</option>
                                            <option value="bug">🐛 Bug Report</option>
                                            <option value="feedback">💭 Feedback</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="Brief description of your issue"
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            rows={5}
                                            placeholder="Describe your issue or question in detail..."
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 outline-none text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] resize-none transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-sm hover:shadow-2xl hover:shadow-[var(--accent-primary)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Community Links Card */}
                            <div className="p-5 rounded-3xl border border-[var(--border-subtle)] bg-black/70 backdrop-blur-xl">
                                <p className="text-xs font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">Other ways to get help</p>
                                <div className="space-y-2.5">
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-all group">
                                        <span className="text-xl">📖</span>
                                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">Documentation</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-all group">
                                        <span className="text-xl">💬</span>
                                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">Community Discord</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-all group">
                                        <span className="text-xl">🐙</span>
                                        <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">GitHub Issues</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
