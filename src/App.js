import React, { Suspense, lazy, useState, useEffect } from 'react'
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles'
import {
  dateFns,
  getEarliestRecord,
  getOutstandingRent,
  getPaymentProgress,
} from './utilities/getData'
import styles from './styles'
import theme from './theme'
import AppBar from './components/AppBar'
import ResponsiveDrawer from './components/ResponsiveDrawer'
const DashboardCharts = lazy(() => import('./components/DashboardCharts'))
const SortableTable = lazy(() => import('./components/SortableTable'))

const appName = 'RT Properties'

const menu = [
  { name: 'Overview', icon: 'dashboard' },
  { name: 'Properties', icon: 'apartment' },
  { name: 'Tenants', icon: 'people' },
  { name: 'Reports', icon: 'insertChart' },
]

const paymentProgressHeader = [
  { id: 'address', label: 'Address', numeric: false, decorator: ''},
  { id: 'rentRoll', label: 'Rent Roll', numeric: true, decorator: '$'},
  { id: 'collected', label: 'Collected', numeric: true, decorator: '$'},
  { id: 'due', label: 'Due', numeric: true, decorator: '$'},
]

const outstandingRentHeader = [
  { id: 'name', label: 'Name', numeric: false, decorator: ''},
  { id: 'status', label: 'Status', numeric: false, decorator: ''},
  { id: 'balance', label: 'Balance', numeric: true, decorator: '$'},
  { id: 'paid', label: 'Paid', numeric: true, decorator: '$'},
  { id: 'source', label: 'Source', numeric: false, decorator: ''},
  { id: 'lastPayment', label: 'Last Payment', numeric: false, decorator: ''},
]

const useStyles = makeStyles(styles)

const App = () => {
  const [data, setData] = useState({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const [date, setDate] = useState(new Date(dateFns.getYear(new Date()), dateFns.getMonth(new Date())).toISOString())
  const [dates, setDates] = useState([date])
  const [paymentProgressData, setPaymentProgressData] = useState([])
  const [outstandingRentData, setOutstandingRentData] = useState([])
  const classes = useStyles()

  useEffect(() => {
    import('../data').then(({data}) => {
      setData(data)
      setPaymentProgressData(getPaymentProgress(data, date))
      setOutstandingRentData(getOutstandingRent(data, date))
      const interval = dateFns.eachMonthOfInterval({ start: getEarliestRecord(data), end: dateFns.parseISO(date)}).map(date => (
        date.toISOString()
      ))
      setDates(interval.reverse())
    })
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDateSelect = event => {
    const date = event.target.value
    setDate(date)
    setPaymentProgressData(getPaymentProgress(data, date))
    setOutstandingRentData(getOutstandingRent(data, date))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar
          appName={appName}
          classes={classes}
          handleDrawerToggle={handleDrawerToggle}
        />
        <ResponsiveDrawer
          appName={appName}
          classes={classes}
          handleDrawerToggle={handleDrawerToggle}
          menu={menu}
          mobileOpen={mobileOpen}
        />
        <Container className={classes.content}>
          <Suspense fallback={<div>Loading...</div>}>
            <Toolbar />
            <Box display="flex" justifyContent="flex-end">
              <Box pl={2}>
                <Typography variant="h5">Overview</Typography>
                <Typography variant="body2">Payment progress overview</Typography>
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
                      {dateFns.format(dateFns.parseISO(date), 'MMMM yyyy')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <DashboardCharts classes={classes} date={date} />
            <SortableTable
              classes={classes}
              headCells={paymentProgressHeader}
              initOrderBy="rentRoll"
              rows={paymentProgressData}
              title="Payment Progress"
            />
            <SortableTable
              classes={classes}
              headCells={outstandingRentHeader}
              initOrder="asc"
              initOrderBy="name"
              initRows={10}
              rows={outstandingRentData}
              title="Outstanding Rent"
            />
          </Suspense>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
