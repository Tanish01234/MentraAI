'use client'

import { useState, useRef } from 'react'

interface ImageUploadButtonProps {
    onImageSelect: (files: File[]) => void
    maxImages?: number
    disabled?: boolean
}

export default function ImageUploadButton({
    onImageSelect,
    maxImages = 3,
    disabled = false
}: ImageUploadButtonProps) {
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (files: FileList | null) => {
        if (!files) return

        const validImages = Array.from(files)
            .filter(file => {
                // Check if it's an image
                if (!file.type.startsWith('image/')) {
                    alert(`${file.name} is not an image file`)
                    return false
                }
                // Check file size (max 20MB)
                if (file.size > 20 * 1024 * 1024) {
                    alert(`${file.name} is too large (max 20MB)`)
                    return false
                }
                return true
            })
            .slice(0, maxImages)

        if (validImages.length > 0) {
            onImageSelect(validImages)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files)
        // Reset input so same file can be selected again
        e.target.value = ''
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
                disabled={disabled}
            />

            <button
                type="button"
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                disabled={disabled}
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 ${dragActive
                        ? 'bg-[var(--accent-primary)]/20 border-2 border-[var(--accent-primary)] scale-110'
                        : 'bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary)]/20 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                    } disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-[var(--accent-primary)]/30`}
                title={dragActive ? 'Drop image here' : 'Upload image (or drag & drop)'}
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                </svg>
            </button>

            {dragActive && (
                <div className="fixed inset-0 z-50 bg-[var(--accent-primary)]/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <div className="genz-card p-8 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-primary)] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg font-bold text-[var(--text-primary)]">Drop image here!</p>
                    </div>
                </div>
            )}
        </>
    )
}
