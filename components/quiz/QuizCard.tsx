'use client'

import { useState, useEffect } from 'react'

interface QuizQuestion {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
    difficulty: string
}

interface QuizCardProps {
    question: QuizQuestion
    questionNumber: number
    totalQuestions: number
    onAnswer: (selectedIndex: number) => void
    onNext: () => void
    timeLimit?: number  // seconds per question, 0 = no timer
}

export default function QuizCard({
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
    onNext,
    timeLimit = 60
}: QuizCardProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [timeLeft, setTimeLeft] = useState(timeLimit)

    // Reset state when question changes
    useEffect(() => {
        setSelectedIndex(null)
        setShowAnswer(false)
        setTimeLeft(timeLimit)
    }, [question, timeLimit])

    // Timer (only if timeLimit > 0)
    useEffect(() => {
        if (showAnswer || timeLimit === 0) return

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up!
                    setShowAnswer(true)
                    onAnswer(-1) // -1 indicates timeout
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [showAnswer, timeLimit])

    const handleOptionClick = (index: number) => {
        if (showAnswer) return

        setSelectedIndex(index)
        setShowAnswer(true)
        onAnswer(index)
    }

    const isCorrect = selectedIndex === question.correctIndex
    const timedOut = selectedIndex === null && showAnswer

    return (
        <div className="genz-card p-6 sm:p-8 max-w-3xl mx-auto animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-sm font-semibold text-[var(--text-muted)]">
                    Question {questionNumber} of {totalQuestions}
                </div>
                {timeLimit > 0 && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${timeLeft <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                        }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}
            </div>

            {/* Question */}
            <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-relaxed">
                    {question.question}
                </h3>
                {question.difficulty && (
                    <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${question.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                            question.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>
                            {question.difficulty.toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
                {question.options.map((option, index) => {
                    const isSelected = selectedIndex === index
                    const isCorrectOption = index === question.correctIndex

                    let optionClass = 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'

                    if (showAnswer) {
                        if (isCorrectOption) {
                            optionClass = 'border-green-500 bg-green-500/10'
                        } else if (isSelected && !isCorrectOption) {
                            optionClass = 'border-red-500 bg-red-500/10'
                        } else {
                            optionClass = 'border-[var(--border-subtle)] opacity-50'
                        }
                    } else if (isSelected) {
                        optionClass = 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(index)}
                            disabled={showAnswer}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${optionClass} ${!showAnswer ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${showAnswer && isCorrectOption ? 'bg-green-500 text-white' :
                                    showAnswer && isSelected && !isCorrectOption ? 'bg-red-500 text-white' :
                                        'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <div className="flex-1 text-sm sm:text-base text-[var(--text-primary)]">
                                    {option}
                                </div>
                                {showAnswer && isCorrectOption && (
                                    <div className="text-green-500">✓</div>
                                )}
                                {showAnswer && isSelected && !isCorrectOption && (
                                    <div className="text-red-500">✗</div>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Explanation */}
            {showAnswer && (
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-2 animate-slide-up ${timedOut ? 'bg-orange-500/10 border-orange-500/30' :
                        isCorrect ? 'bg-green-500/10 border-green-500/30' :
                            'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="font-semibold mb-2 flex items-center gap-2">
                            {timedOut ? (
                                <>
                                    <span>⏰</span>
                                    <span className="text-orange-400">Time's Up!</span>
                                </>
                            ) : isCorrect ? (
                                <>
                                    <span>🎉</span>
                                    <span className="text-green-400">Correct!</span>
                                </>
                            ) : (
                                <>
                                    <span>💡</span>
                                    <span className="text-red-400">Not Quite!</span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {question.explanation}
                        </p>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={onNext}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                        {questionNumber < totalQuestions ? 'Next Question →' : 'View Results 🎯'}
                    </button>
                </div>
            )}
        </div>
    )
}
