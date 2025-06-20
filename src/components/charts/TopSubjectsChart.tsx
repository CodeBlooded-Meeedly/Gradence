import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { TopSubject } from '../../lib/supabase'

interface TopSubjectsChartProps {
  data: TopSubject[]
  title: string
  dataKey: 'average_vote' | 'total_votes'
  colorKey: 'vote' | 'count'
}

export const TopSubjectsChart = ({ data, title, dataKey, colorKey }: TopSubjectsChartProps) => {
  const chartData = data.slice(0, 8).map(item => ({
    name: item.subject_name,
    value: dataKey === 'average_vote' ? item.average_vote : item.total_votes,
    votes: item.total_votes,
    rating: item.average_vote
  }))

  const getColor = (value: number, index: number) => {
    if (colorKey === 'vote') {
      if (value >= 1.5) return '#10B981' // Green
      if (value >= 0.5) return '#F59E0B' // Yellow
      if (value >= -0.5) return '#6B7280' // Gray
      if (value >= -1.5) return '#F97316' // Orange
      return '#EF4444' // Red
    } else {
      // For vote count, use gradient
      const colors = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#059669']
      return colors[index % colors.length]
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/95 border border-red-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          <p className="text-red-400 text-sm font-medium">
            {dataKey === 'average_vote' ? `Rating: ${data.rating}` : `Votes: ${data.votes}`}
          </p>
          <p className="text-gray-400 text-sm">
            {dataKey === 'average_vote' ? `Total Votes: ${data.votes}` : `Rating: ${data.rating}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis 
              type="number"
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value, index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 