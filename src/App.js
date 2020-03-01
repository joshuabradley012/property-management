import React, { Suspense, lazy, useState, useEffect } from 'react'
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  Grid,
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
  isEmpty,
  getAll,
  getDateRange,
  getEarliestRecord,
  getOutstandingRent,
  getPaymentProgress,
} from './utils/getData'
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
  const thisMonth = new Date(dateFns.getYear(new Date()), dateFns.getMonth(new Date())).toISOString()
  const [data, setData] = useState({})
  const [mobileOpen, setMobileOpen] = useState(false)
  const [date, setDate] = useState(thisMonth)
  const classes = useStyles()

  const dates = getDateRange(data, thisMonth)
  const paymentProgressData = getPaymentProgress(data, date)
  const outstandingRentData = getOutstandingRent(data, date)

  useEffect(() => {
    import('../data').then(({data}) => {
      setData(data)
    })
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDateSelect = event => {
    const date = event.target.value
    setDate(date)
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
          <Toolbar />
          <Box display="flex" justifyContent="flex-end" p={1.5} px={[0, 1.5]} pr={[1, 2.5]} pb={0}>
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
                    {dateFns.format(dateFns.parseISO(date), 'MMMM yyyy')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Suspense fallback={<div></div>}>
            <DashboardCharts classes={classes} date={date} data={data} />
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
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
