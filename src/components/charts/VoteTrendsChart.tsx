import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface VoteTrendsChartProps {
  data: any[]
}

export const VoteTrendsChart = ({ data }: VoteTrendsChartProps) => {
  const chartData = data.map(item => ({
    date: item.date_label,
    '💀 Way too hard': item.skull_votes,
    '😴 Too boring': item.sleepy_votes,
    '❤️ Loved the subject': item.heart_votes,
    '🔥 Super fun': item.fire_votes
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
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="💀 Way too hard" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
            name="💀 Way too hard"
          />
          <Line 
            type="monotone" 
            dataKey="😴 Too boring" 
            stroke="#F59E0B" 
            strokeWidth={2}
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
            name="😴 Too boring"
          />
          <Line 
            type="monotone" 
            dataKey="❤️ Loved the subject" 
            stroke="#EC4899" 
            strokeWidth={2}
            dot={{ fill: '#EC4899', strokeWidth: 2, r: 3 }}
            name="❤️ Loved the subject"
          />
          <Line 
            type="monotone" 
            dataKey="🔥 Super fun" 
            stroke="#F97316" 
            strokeWidth={2}
            dot={{ fill: '#F97316', strokeWidth: 2, r: 3 }}
            name="🔥 Super fun"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 