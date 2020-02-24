import React, { lazy, Suspense } from 'react'
import {
  Bar,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
const BarChart = lazy(() => import('recharts/lib/chart/BarChart'))
const ResponsiveContainer = lazy(() => import('recharts/lib/component/ResponsiveContainer'))

const barAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={16} textAnchor="middle" fill="#666">{payload.value}</text>
    </g>
  )
}

const StackedBarChart = ({ data, height }) => (
  <Suspense fallback={<div style={height}></div>}>
    <ResponsiveContainer height={height.height} id="timeline">
      <BarChart data={data} margin={{ top: 16, right: 32, left: 8, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={barAxisTick} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Collected" stackId="a" fill="#1976d2" />
        <Bar dataKey="Due" stackId="a" fill="#d32f2f" />
      </BarChart>
    </ResponsiveContainer>
  </Suspense>
)

export default StackedBarChart