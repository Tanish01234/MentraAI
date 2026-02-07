'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface ProgressChartProps {
    data: {
        date: string
        hours: number
    }[]
}

export default function ProgressChart({ data }: ProgressChartProps) {
    // Format data for chart
    const chartData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))

    return (
        <div className="genz-card p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">
                    Study Activity
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                    Your learning journey over the past 7 days
                </p>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgb(var(--accent-primary-rgb))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="rgb(var(--accent-primary-rgb))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="date"
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="rgb(var(--accent-primary-rgb))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorHours)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
