import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { MostImprovedSubject } from '../../lib/supabase'

interface ImprovementChartProps {
  data: MostImprovedSubject[]
}

export const ImprovementChart = ({ data }: ImprovementChartProps) => {
  const chartData = data.slice(0, 8).map(item => ({
    name: item.subject_name,
    improvement: item.improvement_score,
    current: item.current_rating,
    previous: item.previous_rating
  }))

  const getColor = (improvement: number) => {
    if (improvement > 0.5) return '#10B981' // Green
    if (improvement > 0.2) return '#84CC16' // Light green
    if (improvement > 0) return '#EAB308' // Yellow
    if (improvement > -0.2) return '#F59E0B' // Orange
    if (improvement > -0.5) return '#F97316' // Dark orange
    return '#EF4444' // Red
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/95 border border-red-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          <p className="text-green-400 text-sm font-medium">
            Improvement: {data.improvement.toFixed(2)}
          </p>
          <p className="text-gray-400 text-sm">
            Current: {data.current.toFixed(2)} | Previous: {data.previous.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">📈 Most Improved Subjects</h3>
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
            <Bar dataKey="improvement" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.improvement)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 