import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { HourlyActivity } from '../../lib/supabase'

interface HourlyActivityChartProps {
  data: HourlyActivity[]
}

export const HourlyActivityChart = ({ data }: HourlyActivityChartProps) => {
  const chartData = data.map(item => ({
    hour: item.hour_label,
    votes: item.vote_count
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 border border-red-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          <p className="text-red-400 text-sm font-medium">
            Votes: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis 
            dataKey="hour" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="votes" 
            fill="#EF4444"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 