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
  eachMonthOfInterval,
  format,
  getMonth,
  getYear,
  parseISO,
} from 'date-fns'
import { getIdToken } from '../utils/auth'
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

const fetchData = (queryString, callback) => {
  fetch('https://6wpgd6fc9b.execute-api.us-west-2.amazonaws.com/staging/data?' + queryString, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getIdToken(),
    }
  })
  .then(response => response.json())
  .then(data => callback(data))
  .catch(err => console.error(err))
}

const Dashboard = ({ classes }) => {
  const thisMonth = new Date(getYear(new Date()), getMonth(new Date())).toISOString()
  const [date, setDate] = useState(thisMonth)
  const [dates, setDates] = useState([thisMonth])

  const [paymentProgressData, setPaymentProgressData] = useState([])
  const [outstandingRentData, setOutstandingRentData] = useState([])

  useEffect(() => {
    fetchData('get=earliest-record', (data) => {
      const dateInterval = eachMonthOfInterval({ start: parseISO(data[0].earliestRecord), end: parseISO(date) })
      .map(date => (
        date.toISOString()
      )).reverse()
      setDates(dateInterval)
    })
    fetchData('get=payment-progress&date=' + date, setPaymentProgressData)
    fetchData('get=outstanding-rent&date=' + date, setOutstandingRentData)
  }, [])

  const handleDateSelect = event => {
    const date = event.target.value
    fetchData('get=payment-progress&date=' + date, setPaymentProgressData)
    fetchData('get=outstanding-rent&date=' + date, setOutstandingRentData)
    setDate(date)
  }

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" p={1.5} px={[0, 1.5]} pr={[1, 2.5]} pb={0}>
        <Box pl={2}>
          <Typography variant="h5">Overview</Typography>
          <Typography variant="body2">All properties</Typography>
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
        <DashboardCharts classes={classes} date={date} data={{}} />
        <Box p={1.5} px={[0, 1.5]}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SortableTable
                classes={classes}
                headCells={paymentProgressHeader}
                initOrderBy="rentRoll"
                rows={paymentProgressData}
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
                rows={outstandingRentData}
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
