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
  getRentRoll,
  getRentCollected,
} from '../utilities/getPaymentData'

const data = [];

const dates = [
  { year: '2019', month: '07' },
  { year: '2019', month: '08' },
  { year: '2019', month: '09' },
  { year: '2019', month: '10' },
  { year: '2019', month: '11' },
  { year: '2019', month: '12' },
  { year: '2020', month: '01' },
  { year: '2020', month: '02' },
]

for (const date of dates) {
  let monthRentRoll = 0
  let monthRentCollected = 0
  for (const [propertyId, property] of Object.entries(rentData)) {
    monthRentRoll += getRentRoll(property.account, date)
    monthRentCollected += getRentCollected(property.account, date)
  }
  data.push({
    name: [date.year, date.month].join('-'),
    Collected: monthRentCollected,
    Due: monthRentRoll - monthRentCollected,
  })
}

const DashboardCharts = ({ classes }) => {
  return (
    <Paper variant="outlined" className={classes.dashboardComponent}>
      <BarChart
        width={800}
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
        <Bar dataKey="Collected" stackId="a" fill="#1976d2" />
        <Bar dataKey="Due" stackId="a" fill="#d32f2f" />
      </BarChart>
    </Paper>
  )
}

export default DashboardCharts