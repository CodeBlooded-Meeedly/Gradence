import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { EmojiVoteDistribution } from '../../lib/supabase'

interface VoteDistributionChartProps {
  data: EmojiVoteDistribution[]
}

export const VoteDistributionChart = ({ data }: VoteDistributionChartProps) => {
  const getEmojiColor = (emojiName: string) => {
    switch (emojiName) {
      case '💀 Way too hard': return '#EF4444'
      case '😴 Too boring': return '#F59E0B'
      case '❤️ Loved the subject': return '#EC4899'
      case '🔥 Super fun': return '#F97316'
      default: return '#6B7280'
    }
  }

  const chartData = data.map(item => ({
    name: item.emoji_name,
    value: item.vote_percentage,
    color: getEmojiColor(item.emoji_name),
    count: item.vote_count
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/95 border border-red-500/30 rounded-lg p-3 shadow-2xl backdrop-blur-sm">
          <p className="text-white font-medium mb-2">{data.name}</p>
          <p style={{ color: data.color }} className="text-sm font-medium">
            {data.value.toFixed(1)}% ({data.count} votes)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: any) => (
    <div className="flex justify-center space-x-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded mr-2" 
            style={{ backgroundColor: entry.color }}
          ></div>
          <span className="text-sm text-gray-300">{entry.value}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4">📊 Vote Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 