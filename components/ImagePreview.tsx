'use client'

interface ImagePreviewProps {
    images: File[]
    onRemove: (index: number) => void
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
    if (images.length === 0) return null

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {images.map((file, index) => {
                const imageUrl = URL.createObjectURL(file)

                return (
                    <div
                        key={index}
                        className="relative flex-shrink-0 group"
                    >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
                            <img
                                src={imageUrl}
                                alt={file.name}
                                className="w-full h-full object-cover"
                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                            />
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                            title="Remove image"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* File info */}
                        <div className="mt-1 text-center">
                            <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[80px] sm:max-w-[96px]">
                                {file.name}
                            </p>
                            <p className="text-[9px] text-[var(--text-muted)]">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
