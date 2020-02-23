import React from 'react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Paper,
} from '@material-ui/core'
import { data as rentData } from '../../data'
import {
  getHistory,
} from '../utilities/getData'

const dates = [
  '2020-02',
]

const data = getHistory(rentData, dates)

const DashboardCharts = ({ classes }) => {
  return (
    <Paper variant="outlined" className={classes.dashboardComponent}>
      <BarChart
        width={1200}
        height={300}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Paid" stackId="a" fill="#1976d2" />
        <Bar dataKey="Due" stackId="a" fill="#d32f2f" />
      </BarChart>
    </Paper>
  )
}

export default DashboardCharts