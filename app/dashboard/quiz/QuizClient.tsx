'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/lib/language'
import { supabase } from '@/lib/supabase/client'
import QuizCard from '@/components/quiz/QuizCard'
import ScoreDisplay from '@/components/quiz/ScoreDisplay'
import Leaderboard from '@/components/quiz/Leaderboard'
import { getTopUsers, updateUserScore, calculateQuizXP, subscribeToLeaderboard, unsubscribeFromLeaderboard, type LeaderboardEntry } from '@/lib/utils/leaderboard'

interface QuizQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
    difficulty: string
}

interface QuizSection {
    subject: string
    questions: QuizQuestion[]
}

interface ExamContext {
    examName: string
    examDate: string
    subjects: string[]
    difficulty: string
}

export default function QuizClient() {
    const { user, firstName } = useUser()
    const { selectedLanguage } = useLanguage()
    const searchParams = useSearchParams()

    const [quizState, setQuizState] = useState<'setup' | 'loading' | 'playing' | 'results'>('setup')
    const [topic, setTopic] = useState('')
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
    const [questionCount, setQuestionCount] = useState(10)
    const [timerPerQuestion, setTimerPerQuestion] = useState(60) // seconds, 0 = no timer

    // Exam-based quiz state
    const [examContext, setExamContext] = useState<ExamContext | null>(null)
    const [sections, setSections] = useState<QuizSection[]>([])
    const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>([])

    // Regular quiz state
    const [questions, setQuestions] = useState<QuizQuestion[]>([])

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [loading, setLoading] = useState(false)

    // Real leaderboard data
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
    const [leaderboardLoading, setLeaderboardLoading] = useState(true)

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
        setLeaderboardLoading(true)
        try {
            const data = await getTopUsers(10)
            setLeaderboardData(data)
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error)
        } finally {
            setLeaderboardLoading(false)
        }
    }

    // Load leaderboard on mount and subscribe to changes
    useEffect(() => {
        fetchLeaderboard()

        // Subscribe to real-time updates
        const subscription = subscribeToLeaderboard(() => {
            fetchLeaderboard()
        })

        return () => {
            if (subscription) {
                unsubscribeFromLeaderboard(subscription)
            }
        }
    }, [])

    // Check for exam context in URL params
    useEffect(() => {
        const examParam = searchParams.get('exam')
        if (examParam) {
            try {
                const context: ExamContext = JSON.parse(decodeURIComponent(examParam))
                setExamContext(context)
                setDifficulty(context.difficulty as any || 'medium')
                // Auto-start exam quiz
                startExamQuiz(context)
            } catch (error) {
                console.error('Failed to parse exam context:', error)
            }
        }
    }, [searchParams])

    const startExamQuiz = async (context: ExamContext) => {
        setLoading(true)
        setQuizState('loading')

        try {
            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examName: context.examName,
                    subjects: context.subjects,
                    difficulty: context.difficulty,
                    language: selectedLanguage
                })
            })

            const data = await response.json()

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to generate quiz')
            }

            // Validate response structure
            if (!data.quiz || !data.quiz.sections || !Array.isArray(data.quiz.sections)) {
                console.error('Invalid quiz data structure:', data)
                throw new Error('Invalid quiz data received from server')
            }

            // Store sections
            setSections(data.quiz.sections)

            // Flatten all questions
            const flatQuestions: QuizQuestion[] = []
            data.quiz.sections.forEach((section: QuizSection) => {
                if (section.questions && Array.isArray(section.questions)) {
                    flatQuestions.push(...section.questions)
                }
            })

            if (flatQuestions.length === 0) {
                throw new Error('No questions generated. Please try again.')
            }

            setAllQuestions(flatQuestions)
            setQuizState('playing')
            setCurrentQuestion(0)
            setAnswers([])
        } catch (error: any) {
            console.error('Quiz generation error:', error)
            alert(`Error generating quiz: ${error.message}\n\nPlease try again or use fewer subjects.`)
            setQuizState('setup')
        } finally {
            setLoading(false)
        }
    }

    const startQuiz = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic!')
            return
        }

        setLoading(true)
        setQuizState('loading')
        try {
            const response = await fetch('/api/quiz/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic,
                    difficulty,
                    count: questionCount,
                    language: selectedLanguage
                })
            })

            const data = await response.json()

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to generate quiz')
            }

            if (!data.quiz || !data.quiz.questions || !Array.isArray(data.quiz.questions)) {
                console.error('Invalid quiz data:', data)
                throw new Error('Invalid quiz data received')
            }

            setQuestions(data.quiz.questions)
            setQuizState('playing')
            setCurrentQuestion(0)
            setAnswers([])
        } catch (error: any) {
            console.error('Quiz generation error:', error)
            alert(`Error: ${error.message}`)
            setQuizState('setup')
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (selectedIndex: number) => {
        setAnswers(prev => [...prev, selectedIndex])
    }

    const handleNextQuestion = () => {
        const totalQuestions = examContext ? allQuestions.length : questions.length
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            // Quiz finished - save to history
            saveQuizToHistory()
            setQuizState('results')
        }
    }

    const saveQuizToHistory = async () => {
        if (!user?.id || !supabase) return

        try {
            const sessionId = crypto.randomUUID()
            const isExamQuiz = !!examContext
            const totalQuestions = isExamQuiz ? allQuestions.length : questions.length
            const questionsList = isExamQuiz ? allQuestions : questions
            const correctAnswers = answers.filter((answer, idx) => answer === questionsList[idx]?.correctIndex).length
            const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1)

            // Calculate XP and update leaderboard
            const xpData = calculateQuizXP(correctAnswers, totalQuestions)
            const quizScore = correctAnswers * 100

            // Update user score in leaderboard
            await updateUserScore(
                user.id,
                firstName || user.email?.split('@')[0] || 'User',
                quizScore,
                xpData.totalXP
            )

            // Calculate subject-wise scores for exam quiz
            let sectionScores: any[] = []
            if (isExamQuiz && sections.length > 0) {
                let questionIndex = 0
                sectionScores = sections.map(section => {
                    const sectionAnswers = answers.slice(questionIndex, questionIndex + section.questions.length)
                    const correct = sectionAnswers.filter((answer, idx) =>
                        answer === section.questions[idx]?.correctIndex
                    ).length
                    questionIndex += section.questions.length
                    return {
                        subject: section.subject,
                        correct,
                        total: section.questions.length
                    }
                })
            }

            await supabase.from('history').insert({
                user_id: user.id,
                session_id: sessionId,
                module_type: 'quiz',
                content: {
                    examName: examContext?.examName || topic,
                    subjects: examContext?.subjects || [topic],
                    score: correctAnswers,
                    total: totalQuestions,
                    percentage,
                    sections: sectionScores,
                    questions: questionsList,
                    userAnswers: answers,
                    isExamQuiz
                },
                metadata: {
                    exam_name: examContext?.examName || topic,
                    subjects: examContext?.subjects || [topic],
                    score: `${correctAnswers}/${totalQuestions}`
                },
                title: examContext
                    ? `${examContext.examName} Quiz - ${correctAnswers}/${totalQuestions}`
                    : `${topic} Quiz - ${correctAnswers}/${totalQuestions}`
            })

            console.log('✅ Quiz saved to history!')
        } catch (error) {
            console.error('Failed to save quiz to history:', error)
        }
    }

    const calculateScore = () => {
        const questionsList = examContext ? allQuestions : questions
        const correctAnswers = answers.filter((answer, idx) => answer === questionsList[idx]?.correctIndex).length
        const baseXP = correctAnswers * 10
        const streakBonus = correctAnswers === questionsList.length ? 25 : 0
        const timeBonus = Math.floor(Math.random() * 10) // Demo

        return {
            score: correctAnswers * 100,
            totalQuestions: questionsList.length,
            correctAnswers,
            xpEarned: baseXP + streakBonus + timeBonus,
            timeBonus,
            newLevel: correctAnswers >= 4 ? 10 : undefined
        }
    }

    const resetQuiz = () => {
        setQuizState('setup')
        setTopic('')
        setQuestions([])
        setAllQuestions([])
        setSections([])
        setExamContext(null)
        setCurrentQuestion(0)
        setAnswers([])
    }

    // Get current section info for exam quiz
    const getCurrentSection = () => {
        if (!examContext || sections.length === 0) return null

        let questionCount = 0
        for (const section of sections) {
            if (currentQuestion < questionCount + section.questions.length) {
                return {
                    name: section.subject,
                    questionInSection: currentQuestion - questionCount + 1,
                    totalInSection: section.questions.length
                }
            }
            questionCount += section.questions.length
        }
        return null
    }

    const currentSectionInfo = getCurrentSection()

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-12">
                {/* Page Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3">
                        {examContext ? `📝 ${examContext.examName}` : '🎮 Quiz Battle Arena'}
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)]">
                        {examContext
                            ? `Practice quiz for ${examContext.subjects.join(', ')}`
                            : 'Test your knowledge, earn XP, and climb the leaderboard!'
                        }
                    </p>
                </div>

                {/* Loading State */}
                {quizState === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <svg className="animate-spin h-16 w-16 text-[var(--accent-primary)] mb-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Generating Your Quiz...</h2>
                        <p className="text-[var(--text-secondary)]">
                            Creating {examContext ? `${examContext.subjects.length * 20} questions` : '5 questions'} for you
                        </p>
                    </div>
                )}

                {/* Setup State */}
                {quizState === 'setup' && !examContext && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quiz Setup */}
                        <div className="lg:col-span-2">
                            <div className="genz-card p-6 sm:p-8">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                                    Create Your Quiz
                                </h2>

                                <div className="space-y-4">
                                    {/* Topic Input */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Topic
                                        </label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="e.g., Photosynthesis, Quadratic Equations..."
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] focus:border-[var(--accent-primary)] outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                                            onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
                                        />
                                    </div>

                                    {/* Difficulty */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Difficulty Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {(['easy', 'medium', 'hard'] as const).map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setDifficulty(level)}
                                                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${difficulty === level
                                                        ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg'
                                                        : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                                                        }`}
                                                >
                                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Question Count */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Number of Questions
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {[5, 10, 15, 20].map((count) => (
                                                <button
                                                    key={count}
                                                    onClick={() => setQuestionCount(count)}
                                                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${questionCount === count
                                                        ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg'
                                                        : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                                                        }`}
                                                >
                                                    {count}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Timer Per Question */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                            Timer Per Question
                                        </label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {[
                                                { value: 30, label: '30s' },
                                                { value: 60, label: '1m' },
                                                { value: 90, label: '1.5m' },
                                                { value: 120, label: '2m' },
                                                { value: 0, label: 'No Timer' }
                                            ].map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setTimerPerQuestion(option.value)}
                                                    className={`py-2.5 px-3 rounded-xl font-semibold text-sm transition-all duration-300 ${timerPerQuestion === option.value
                                                        ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg'
                                                        : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Start Button */}
                                    <button
                                        onClick={startQuiz}
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Generating Quiz...
                                            </span>
                                        ) : (
                                            '🚀 Start Quiz'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard */}
                        <div>
                            <Leaderboard
                                entries={leaderboardData}
                                currentUser={firstName}
                                loading={leaderboardLoading}
                                onRefresh={fetchLeaderboard}
                            />
                        </div>
                    </div>
                )}

                {/* Playing State */}
                {quizState === 'playing' && (
                    <div>
                        {/* Section Info for Exam Quiz */}
                        {examContext && currentSectionInfo && (
                            <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                            📚 {currentSectionInfo.name}
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Question {currentSectionInfo.questionInSection} of {currentSectionInfo.totalInSection} in this section
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[var(--accent-primary)]">
                                            {currentQuestion + 1}/{allQuestions.length}
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)]">Overall Progress</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <QuizCard
                            question={examContext ? allQuestions[currentQuestion] : questions[currentQuestion]}
                            questionNumber={currentQuestion + 1}
                            totalQuestions={examContext ? allQuestions.length : questions.length}
                            onAnswer={handleAnswer}
                            onNext={handleNextQuestion}
                            timeLimit={timerPerQuestion}
                        />
                    </div>
                )}

                {/* Results State */}
                {quizState === 'results' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            {/* Subject-wise scores for exam quiz */}
                            {examContext && sections.length > 0 && (
                                <div className="genz-card p-6 mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                                        📊 Subject-wise Performance
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {sections.map((section, idx) => {
                                            let questionIndex = 0
                                            for (let i = 0; i < idx; i++) {
                                                questionIndex += sections[i].questions.length
                                            }
                                            const sectionAnswers = answers.slice(questionIndex, questionIndex + section.questions.length)
                                            const correct = sectionAnswers.filter((answer, i) =>
                                                answer === section.questions[i]?.correctIndex
                                            ).length
                                            const percentage = (correct / section.questions.length * 100).toFixed(0)

                                            return (
                                                <div key={section.subject} className="p-4 bg-[var(--bg-elevated)] rounded-xl">
                                                    <h3 className="font-semibold text-[var(--text-primary)] mb-2">{section.subject}</h3>
                                                    <div className="text-3xl font-bold text-[var(--accent-primary)] mb-2">
                                                        {correct}/{section.questions.length}
                                                    </div>
                                                    <div className="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
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

                            <ScoreDisplay
                                result={calculateScore()}
                                onRetry={resetQuiz}
                                onNewQuiz={resetQuiz}
                            />
                        </div>
                        <div>
                            <Leaderboard
                                entries={leaderboardData}
                                currentUser={firstName}
                                loading={leaderboardLoading}
                                onRefresh={fetchLeaderboard}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
