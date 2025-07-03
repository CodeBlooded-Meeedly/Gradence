import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Top3PositiveSubject } from '../../lib/supabase'

interface Top3PositiveChartProps {
  data: Top3PositiveSubject[]
  showMedals?: boolean
  showVoteAggregates?: boolean
}

const medalEmojis = ['🥇', '🥈', '🥉']

export const Top3PositiveChart = ({ data, showMedals = false, showVoteAggregates = false }: Top3PositiveChartProps) => {
  const chartData = data.map((item, idx) => ({
    name: showMedals ? `${medalEmojis[idx] || ''} ${item.subject_name}` : item.subject_name,
    averageVote: item.average_rating,
    totalVotes: item.total_votes,
    rank: item.rank_position
  }))

  const colors = ['#10b981', '#34d399', '#6ee7b7'] // Green shades for best rated subjects

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
            dataKey="name" 
            stroke="#9ca3af"
            fontSize={12}
            width={180}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            formatter={(value: any, _name: string, props: any) => [
              `Average Rating : ${value} rating`,
              showVoteAggregates ? `${props.payload.totalVotes} votes` : 'Average Rating'
            ]}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="averageVote" radius={[0, 4, 4, 0]}>
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {showVoteAggregates && (
        <div className="flex flex-col mt-2 space-y-1">
          {data.map((item, idx) => (
            <div key={item.subject_id} className="text-sm text-gray-300 flex items-center">
              {showMedals && <span className="mr-2">{medalEmojis[idx]}</span>}
              <span className="font-semibold">{item.subject_name}</span>
              <span className="ml-2">({item.total_votes} votes)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 