import React, { lazy, Suspense, useState } from 'react'
import {
  Cell,
  Label,
  Legend,
  Pie,
  Tooltip,
} from 'recharts'
const PieChart = lazy(() => import('recharts/lib/chart/PieChart'))
const ResponsiveContainer = lazy(() => import('recharts/lib/component/ResponsiveContainer'))

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#fbc02d' ];

const PieLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const ResponsivePieChart = ({ data, height }) => {
  const [tooltipActive, setTooltipActive] = useState(false)
  return (
    <Suspense fallback={<div style={height}></div>}>
      <ResponsiveContainer height={height.height} id="source">
        <PieChart>
          <Pie
            data={data}
            innerRadius="55%"
            paddingAngle={2}
            labelLine={false}
            label={<PieLabel />}
            dataKey="value"
          >
            {
              data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>)
            }
          </Pie>
          <text x="50%" y="46%" dy={8} textAnchor="middle" fill="#666">Payment Source</text>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Suspense>
  )
}

export default ResponsivePieChart