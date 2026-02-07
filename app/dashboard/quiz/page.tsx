import { Suspense } from 'react'
import QuizClient from './QuizClient'
import QuizLoadingFallback from './QuizLoadingFallback'

export default function QuizPage() {
    return (
        <Suspense fallback={<QuizLoadingFallback />}>
            <QuizClient />
        </Suspense>
    )
}
