export default function QuizLoadingFallback() {
    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-36 pb-12">
                {/* Page Header Skeleton */}
                <div className="mb-8 sm:mb-10 animate-pulse">
                    <div className="h-10 bg-[var(--bg-elevated)] rounded-lg w-64 mb-3"></div>
                    <div className="h-6 bg-[var(--bg-elevated)] rounded-lg w-96"></div>
                </div>

                {/* Loading Spinner */}
                <div className="flex flex-col items-center justify-center py-20">
                    <svg className="animate-spin h-16 w-16 text-[var(--accent-primary)] mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Loading Quiz...</h2>
                    <p className="text-[var(--text-secondary)]">
                        Preparing your quiz experience
                    </p>
                </div>
            </div>
        </div>
    )
}
