import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { TodaysTop3Subject } from '../../lib/supabase'

interface Top3TodayChartProps {
  data: TodaysTop3Subject[]
}

export const Top3TodayChart = ({ data }: Top3TodayChartProps) => {
  const chartData = data.map(item => ({
    name: item.subject_name,
    votes: item.todays_votes,
    rating: item.average_vote,
    rank: item.rank_position
  }))

  const colors = ['#ef4444', '#f97316', '#eab308'] // Red, Orange, Yellow for top 3

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `${value} votes`}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af"
            fontSize={12}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            formatter={(value: any, _name: string) => [
              `${value} votes`,
              'Today\'s Votes'
            ]}
            labelFormatter={(label) => `${label} (Rank #${chartData.find(d => d.name === label)?.rank})`}
          />
          <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 