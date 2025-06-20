import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { WeeklyTrendingSubject } from '../../lib/supabase'

interface WeeklyTrendsChartProps {
  data: WeeklyTrendingSubject[]
}

export const WeeklyTrendsChart = ({ data }: WeeklyTrendsChartProps) => {
  const chartData = data.map(item => ({
    name: item.subject_name,
    votes: item.weekly_votes,
    rating: item.average_vote
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 border border-red-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">📈 Weekly Trending Subjects</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="votes" 
              fill="#EF4444" 
              radius={[4, 4, 0, 0]}
              name="Weekly Votes"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="rating" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              name="Average Rating"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 