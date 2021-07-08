import React, {
  Fragment,
  lazy,
  Suspense,
  useState,
  useEffect
} from 'react'
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  getMonth,
  getYear,
  lastDayOfMonth,
  parseISO,
} from 'date-fns'
import { fetchData } from '../utils/auth'
const DashboardCharts = lazy(() => import('./DashboardCharts'))
const SortableTable = lazy(() => import('./SortableTable'))

const paymentProgressHeader = [
  { id: 'name', label: 'Address', format: 'string'},
  { id: 'rentRoll', label: 'Rent Roll', format: 'currency'},
  { id: 'collected', label: 'Collected', format: 'currency'},
  { id: 'due', label: 'Due', format: 'currency'},
]

const outstandingRentHeader = [
  { id: 'name', label: 'Name', format: 'string'},
  { id: 'status', label: 'Status', format: 'string'},
  { id: 'balance', label: 'Balance', format: 'currency'},
  { id: 'paid', label: 'Paid', format: 'currency'},
  { id: 'source', label: 'Source', format: 'string'},
  { id: 'lastPayment', label: 'Last Payment', format: 'date'},
]

const Dashboard = ({ classes }) => {
  const thisMonth = new Date(getYear(new Date()), getMonth(new Date())).toISOString()
  const [date, setDate] = useState(thisMonth)
  const [dates, setDates] = useState([thisMonth])
  const [dashboardData, setDashboardData] = useState({
    rentCollected: null,
    rentRoll: null,
    lateFees: null,
    reimbursements: null,
    paymentTimeline: [],
    paymentSources: [],
    paymentProgress: [],
    outstandingRent: [],
  })

  const handleTimelineData = data => {
    if (!data || !data.length) return []
    let rowIndex = 0
    let total = 0
    let currentRow = data[rowIndex]
    const timeline = []
    eachDayOfInterval({
      start: new Date(getYear(parseISO(date)), getMonth(parseISO(date))),
      end: lastDayOfMonth(parseISO(date))
    }).forEach(day => {
      if (currentRow.name.split('T')[0] === day.toISOString().split('T')[0]) {
        total += currentRow.collected
        rowIndex++
        if (rowIndex < data.length) {
          currentRow = data[rowIndex]
        }
      }
      timeline.push({
        name: format(day, 'M/d'),
        Collected: total,
        Due: currentRow.due - total
      })
    })
    return timeline
  }

  const handleDashboardData = data => {
    data.paymentTimeline = handleTimelineData(data.paymentTimeline)
    setDashboardData(data)
  }

  const handleDateSelect = event => {
    const date = event.target.value
    setDate(date)
  }

  useEffect(() => {
    fetchData('fields=earliest-record', (data) => {
      const dateInterval = eachMonthOfInterval({
        start: parseISO(data.earliestRecord),
        end: parseISO(date)
      })
      .map(date => (
        date.toISOString()
      )).reverse()
      setDates(dateInterval)
    })
  }, [])

  useEffect(() => {
    const fields = [
      'rent-collected',
      'rent-roll',
      'late-fees',
      'reimbursements',
      'payment-timeline',
      'payment-sources',
      'payment-progress',
      'outstanding-rent',
    ]
    fetchData('fields=' + fields.join(',') + '&date=' + date, handleDashboardData)
  }, [date])

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" p={1.5} px={[0, 1.5]} pr={[1, 2.5]} pb={0}>
        <Box pl={2}>
          <Typography variant="h5">Overview</Typography>
          <Typography variant="body2">Payment progress</Typography>
        </Box>
        <FormControl variant="standard" className={classes.formControl}>
          <InputLabel id="date">Date</InputLabel>
          <Select
            labelId="date"
            id="date-select"
            value={date}
            onChange={handleDateSelect}
          >
            {dates.map(date => (
              <MenuItem key={date} value={date}>
                {format(parseISO(date), 'MMMM yyyy')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Suspense fallback={<div></div>}>
        <DashboardCharts classes={classes} date={date} data={dashboardData} />
        <Box p={1.5} px={[0, 1.5]}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SortableTable
                classes={classes}
                headCells={paymentProgressHeader}
                initOrderBy="rentRoll"
                rows={dashboardData.paymentProgress}
                title="Payment Progress"
              />
            </Grid>
            <Grid item xs={12}>
              <SortableTable
                classes={classes}
                headCells={outstandingRentHeader}
                initOrder="asc"
                initOrderBy="name"
                initRows={10}
                rows={dashboardData.outstandingRent}
                title="Outstanding Rent"
              />
            </Grid>
          </Grid>
        </Box>
      </Suspense>
    </Fragment>
  )
}

export default Dashboard
