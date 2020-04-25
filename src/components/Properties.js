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

const Properties = ({ classes }) => {
  const thisMonth = new Date(getYear(new Date()), getMonth(new Date())).toISOString()
  const [date, setDate] = useState(thisMonth)
  const [dates, setDates] = useState([thisMonth])

  return (
    <Fragment>
      <Box display="flex" justifyContent="space-between" p={1.5} px={[0, 1.5]} pr={[1, 2.5]} pb={0}>
        <Box pl={2}>
          <Typography variant="h5">Properties</Typography>
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