import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Top3BoringSubject } from '../../lib/supabase'

interface Top3BoringChartProps {
  data: Top3BoringSubject[]
}

export const Top3BoringChart = ({ data }: Top3BoringChartProps) => {
  const chartData = data.map(item => ({
    subjectName: item.subject_name,
    averageVote: item.total_rating_sum,
    totalVotes: item.total_votes,
    rank: item.rank_position
  }))

  const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd'] // Purple shades for worst rated subjects

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
            tickFormatter={(value) => `${value} rating`}
          />
          <YAxis 
            type="category" 
            dataKey="subjectName" 
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
              `${value} rating`,
              'Average Rating'
            ]}
            labelFormatter={(label) => {
              const item = chartData.find(d => d.subjectName === label)
              return `${label} (${item?.totalVotes} votes, Rank #${item?.rank})`
            }}
          />
          <Bar dataKey="averageVote" radius={[0, 4, 4, 0]}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 