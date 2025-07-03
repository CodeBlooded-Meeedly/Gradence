import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Top10TrendsChartDatum {
  subject_name: string
  date_label: string
  vote_count: number
}

interface Top10TrendsChartProps {
  data: Top10TrendsChartDatum[]
}

export const Top10TrendsChart = ({ data }: Top10TrendsChartProps) => {
  // Group data by date_label, then by subject_name
  const subjects = Array.from(new Set(data.map(d => d.subject_name)))
  const dates = Array.from(new Set(data.map(d => d.date_label)))
  // Build chartData: [{ date_label, [subject1]: count, [subject2]: count, ... }]
  const chartData = dates.map(date => {
    const entry: any = { date }
    subjects.forEach(subject => {
      const found = data.find(d => d.subject_name === subject && d.date_label === date)
      entry[subject] = found ? found.vote_count : 0
    })
    return entry
  })
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#6b7280'
  ]
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={value => `${value} votes`} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f9fafb' }} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }} />
          {subjects.map((subject, idx) => (
            <Line
              key={subject}
              type="monotone"
              dataKey={subject}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              name={subject}
              dot={{ fill: colors[idx % colors.length], strokeWidth: 2, r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 