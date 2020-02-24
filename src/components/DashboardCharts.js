import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import { data as rentData } from '../../data'
import {
  getHistory,
  getLateFees,
  getReimbursements,
  getRentCollected,
  getRentRoll,
  getSource,
} from '../utilities/getData'

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#fbc02d' ];

const barAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text dy={16} textAnchor="middle" fill="#666">{payload.value}</text>
    </g>
  )
}

const pieLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
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

const DashboardCharts = ({ classes, date }) => {
  const barData = getHistory(rentData, [date])
  const pieData = getSource(rentData, date)

  return (
    <Box p={1.5} px={[0, 1.5]}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <Paper variant="outlined" style={{ height: 320 }}>
            <Box p={2}>
              <Box mb={1}>
                <Typography variant="subtitle2">Total Collected</Typography>
                <Typography variant="h2">${getRentCollected(rentData.entries, date).toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Rent Roll</Typography>
                <Typography variant="h5">${getRentRoll(rentData.records, date).toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Fees</Typography>
                <Typography variant="h5">${getLateFees(rentData.entries, date).toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Reimbursements</Typography>
                <Typography variant="h5">${getReimbursements(rentData.entries, date).toLocaleString()}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={5}>
          <Paper variant="outlined">
            {/*<Box pt={2} pl={2}><Typography variant="subtitle2">Timeline</Typography></Box>*/}
            <ResponsiveContainer height={320}>
              <BarChart data={barData} margin={{ top: 40, right: 32, left: 16, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={barAxisTick} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Collected" stackId="a" fill="#1976d2" />
                <Bar dataKey="Due" stackId="a" fill="#d32f2f" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Paper variant="outlined">
            {/*<Box pt={2} pl={2}><Typography variant="subtitle2">Source</Typography></Box>*/}
            <ResponsiveContainer height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius="55%"
                  paddingAngle={5}
                  labelLine={false}
                  label={pieLabel}
                  dataKey="value"
                >
                  {
                    pieData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]}/>)
                  }
                </Pie>
                <text x="50%" y="46%" dy={8} textAnchor="middle" fill="#666">Payment Source</text>
                <Tooltip/>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardCharts