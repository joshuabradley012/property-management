import React, { lazy, Suspense } from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
const StackedBarChart = lazy(() => import('./StackedBarChart'))
const ResponsivePieChart = lazy(() => import('./ResponsivePieChart'))

const DashboardCharts = ({ classes, date, data }) => {
  const chartHeight = { height: 280 }
  const barData = data.paymentTimeline
  const pieData = data.paymentSources
  const rentCollected = data.rentCollected ? data.rentCollected : 0
  const rentRoll = data.rentRoll ? data.rentRoll : 0
  const due = rentRoll - rentCollected
  const lateFees = data.lateFees ? data.lateFees : 0
  const reinbursements = data.reinbursements ? data.reinbursements : 0

  return (
    <Box p={1.5} px={[0, 1.5]}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={4}>
          <Paper variant="outlined" style={{ height: '100%' }}>
            <Box p={2}>
              <Box mb={1}>
                <Typography variant="subtitle2">Total Collected</Typography>
                <Typography variant="h2">${rentCollected.toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Rent Roll</Typography>
                <Typography variant="h5">${rentRoll.toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Fees</Typography>
                <Typography variant="h5">${lateFees.toLocaleString()}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="caption">Reimbursements</Typography>
                <Typography variant="h5">${reinbursements.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7} lg={5}>
          <Paper variant="outlined">
            <Box pt={2} pl={2}><Typography variant="subtitle2">Timeline</Typography></Box>
            <Suspense fallback={<div style={chartHeight}></div>}>
              <StackedBarChart data={barData} height={chartHeight} />
            </Suspense>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} lg={3}>
          <Paper variant="outlined">
            <Box pt={2} pl={2}><Typography variant="subtitle2">Source</Typography></Box>
            <Suspense fallback={<div style={chartHeight}></div>}>
              <ResponsivePieChart data={pieData} height={chartHeight} />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardCharts