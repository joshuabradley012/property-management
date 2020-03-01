import { add, addBusinessDays, addDays, addHours, addISOWeekYears, addMilliseconds, addMinutes, addMonths, addQuarters, addSeconds, addWeeks, addYears, areIntervalsOverlapping, compareAsc, compareDesc, differenceInBusinessDays, differenceInCalendarDays, differenceInCalendarISOWeekYears, differenceInCalendarISOWeeks, differenceInCalendarMonths, differenceInCalendarQuarters, differenceInCalendarWeeks, differenceInCalendarYears, differenceInDays, differenceInHours, differenceInISOWeekYears, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInQuarters, differenceInSeconds, differenceInWeeks, differenceInYears, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, eachWeekendOfInterval, eachWeekendOfMonth, eachWeekendOfYear, eachYearOfInterval, format, getDate, getDay, getDayOfYear, getDaysInMonth, getDaysInYear, getDecade, getHours, getISODay, getISOWeek, getISOWeekYear, getISOWeeksInYear, getMilliseconds, getMinutes, getMonth, getOverlappingDaysInIntervals, getQuarter, getSeconds, getTime, getUnixTime, getWeek, getWeekOfMonth, getWeekYear, getWeeksInMonth, getYear, isAfter, isBefore, isDate, isEqual, isExists, isFirstDayOfMonth, isFriday, isFuture, isLastDayOfMonth, isLeapYear, isMonday, isPast, isSameDay, isSameHour, isSameISOWeek, isSameISOWeekYear, isSameMinute, isSameMonth, isSameQuarter, isSameSecond, isSameWeek, isSameYear, isSaturday, isSunday, isThisHour, isThisISOWeek, isThisMinute, isThisMonth, isThisQuarter, isThisSecond, isThisWeek, isThisYear, isThursday, isToday, isTomorrow, isTuesday, isValid, isWednesday, isWeekend, isWithinInterval, isYesterday, parseISO } from 'date-fns'

class Item extends Object {
  constructor(...proto) {
    super(...proto)
    Object.assign(this, ...proto)

    this.isEmpty = this.isEmpty.bind(this)
    this.hasPair = this.hasPair.bind(this)
  }

  isEmpty() {
    return Object.entries(this).length === 0
  }

  hasPair([key, value]) {
    return this[key] === value
  }

  hasAll(args) {
    return Object.entries(args).every(this.hasPair)
  }

  hasAny(args) {
    return Object.entries(args).some(this.hasPair)
  }
}

class Items extends Array {
  constructor(...proto) {
    super(...proto)
    Object.assign(this, ...proto)
  }

  getItem(args) {
    return this.find(item => item.hasAll(item, args))
  }

  getItems(args) {
    return this.filter(item => item.hasAll(args))
  }

  getTotal() {
    return this.reduce((total, item) => total += item.amount, 0)
  }
}

const itemsFromArray = (array) => new Items(array.map(element => new Item(element)))

const getRentRollRecords = (records) => getAll(records, {category: 'Invoice', type: 'Rent'})
const getRentEntries = (entries) => getAll(entries, {category: 'Income', type: 'Rent'})
const getLateFeeEntries = (entries) => getAll(entries,  {category: 'Income', type: 'Late Fee'})
const getReimbursementEntries = (entries) => getAll(entries,  {category: 'Expense', type: 'Reimbursement'})
const getTenantRentEntry = (entries, tenantId) => getItem(entries, {category: 'Income', type: 'Rent', tenant: tenantId})
const getTenantRentRecord = (records, tenantId) => getItem(records, {category: 'Invoice', type: 'Rent', tenant: tenantId})

const getPaymentProgress = (data, date) => {

}

const getPaymentProgress = (data, date) => {
  const rows = []
  if (!isEmpty(data)) {
    for (const property of data.properties) {
      if (property.buildings) {
        const buildings = getAllById(data.buildings, property.buildings)
        let rentRoll = 0
        let collected = 0
        for (const building of buildings) {
          const records = getAllById(data.records, building.records)
          const entries = getAllById(data.entries, building.entries)
          rentRoll += getRentRoll(records, date)
          collected += getRentCollected(entries, date)
        }
        const due = rentRoll - collected
        rows.push({
          address: property.address.line1,
          rentRoll: rentRoll,
          collected: collected,
          due: due,
        })
      } else {
        const records = getAllById(data.records, property.records)
        const entries = getAllById(data.entries, property.entries)
        const rentRoll = getRentRoll(records, date)
        const collected = getRentCollected(entries, date)
        const due = rentRoll - collected
        rows.push({
          address: property.address.line1,
          rentRoll: rentRoll,
          collected: collected,
          due: due,
        })
      }
    }
  }
  return rows
}

const getOutstandingRent = (data, date) => {
  let rows = []
  if (!isEmpty(data)) {
    for (const tenant of data.tenants) {
      const records = getAll(data.records, { tenant: tenant.id }, date)
      const entries = getAll(data.entries, { tenant: tenant.id }, date)
      const rentRoll = getRentRoll(records, date)
      const collected = getRentCollected(entries, date)
      const balance = rentRoll - collected
      const status = (balance > 0) ? 'Unpaid' : collected ? 'Paid' : '–'
      const entry = getTenantRentEntry(entries, tenant.id, date)
      const source = entry && entry.source ? entry.source : status === 'Paid' && collected ? 'Other' : '–'
      const lastPayment = entry && entry.date ? entry.date.substring(0,10) : '–'
      rows.push({
        name: tenant.name,
        status: status,
        balance: balance,
        paid: collected,
        source: source,
        lastPayment: lastPayment,
      })
    }
  }
  return rows
}

const getHistory = (data, dates) => {
  const history = []
  if (!isEmpty(data)) {
    for (const date of dates) {
      const monthRentRoll = getRentRoll(data.records, date)
      const daysInMonth = getDaysInMonth(parseISO(date))
      let monthRentCollected = 0
      for (var i = 0; i < daysInMonth; i++) {
        const dateWithDay = new Date(getYear(parseISO(date)), getMonth(parseISO(date)), i + 1).toISOString()
        monthRentCollected += getRentCollected(data.entries, { operator: 'isSameDay', date: dateWithDay })
        history.push({
          name: format(parseISO(dateWithDay), 'MMM dd'),
          Collected: monthRentCollected,
          Due: monthRentRoll - monthRentCollected,
        })
      }
    }
  }
  return history
}

const getSource = (data, date) => {
  const sources = []
  if (!isEmpty(data)) {
    const sourceTypes = []
    const rentPayments = getAll(data.entries, {category: 'Income', type: 'Rent'}, date)
    for (const payment of rentPayments) {
      const sourceType = payment.source ? payment.source : 'Other'
      if (!sourceTypes.includes(sourceType)) {
        sourceTypes.push(sourceType)
        sources.push({
          name: sourceType,
          value: payment.amount,
        })
      } else {
        for (const source of sources) {
          if (source.name === sourceType) {
            source.value += payment.amount
          }
        }
      }
    }
  }
  return sources
}

const getEarliestRecord = (data) => {
  let earliestRecord = new Date();
  if (!isEmpty(data)) {
    for (const record of data.records) {
      if (isBefore(parseISO(record.date), earliestRecord)) earliestRecord = parseISO(record.date)
    }
  }
  return earliestRecord
}

const getDateRange = (data, date, endDate) => {
  return isEmpty(data) ? [date] : dateFns.eachMonthOfInterval({ start: getEarliestRecord(data), end: dateFns.parseISO(date)})
  .map(date => (
    date.toISOString()
  )).reverse()
}

export {
  isEmpty,
  getAll,
  getDateRange,
  getHistory,
  getEarliestRecord,
  getLateFees,
  getOutstandingRent,
  getPaymentProgress,
  getReimbursements,
  getRentRoll,
  getRentCollected,
  getSource,
  getTenantRentOwed,
  getTenantRentEntry,
}
