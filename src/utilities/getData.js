import { add, addBusinessDays, addDays, addHours, addISOWeekYears, addMilliseconds, addMinutes, addMonths, addQuarters, addSeconds, addWeeks, addYears, areIntervalsOverlapping, compareAsc, compareDesc, differenceInBusinessDays, differenceInCalendarDays, differenceInCalendarISOWeekYears, differenceInCalendarISOWeeks, differenceInCalendarMonths, differenceInCalendarQuarters, differenceInCalendarWeeks, differenceInCalendarYears, differenceInDays, differenceInHours, differenceInISOWeekYears, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInQuarters, differenceInSeconds, differenceInWeeks, differenceInYears, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, eachWeekendOfInterval, eachWeekendOfMonth, eachWeekendOfYear, eachYearOfInterval, format, getDate, getDay, getDayOfYear, getDaysInMonth, getDaysInYear, getDecade, getHours, getISODay, getISOWeek, getISOWeekYear, getISOWeeksInYear, getMilliseconds, getMinutes, getMonth, getOverlappingDaysInIntervals, getQuarter, getSeconds, getTime, getUnixTime, getWeek, getWeekOfMonth, getWeekYear, getWeeksInMonth, getYear, isAfter, isBefore, isDate, isEqual, isExists, isFirstDayOfMonth, isFriday, isFuture, isLastDayOfMonth, isLeapYear, isMonday, isPast, isSameDay, isSameHour, isSameISOWeek, isSameISOWeekYear, isSameMinute, isSameMonth, isSameQuarter, isSameSecond, isSameWeek, isSameYear, isSaturday, isSunday, isThisHour, isThisISOWeek, isThisMinute, isThisMonth, isThisQuarter, isThisSecond, isThisWeek, isThisYear, isThursday, isToday, isTomorrow, isTuesday, isValid, isWednesday, isWeekend, isWithinInterval, isYesterday, parseISO } from 'date-fns'
const dateFns = { add, addBusinessDays, addDays, addHours, addISOWeekYears, addMilliseconds, addMinutes, addMonths, addQuarters, addSeconds, addWeeks, addYears, areIntervalsOverlapping, compareAsc, compareDesc, differenceInBusinessDays, differenceInCalendarDays, differenceInCalendarISOWeekYears, differenceInCalendarISOWeeks, differenceInCalendarMonths, differenceInCalendarQuarters, differenceInCalendarWeeks, differenceInCalendarYears, differenceInDays, differenceInHours, differenceInISOWeekYears, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInQuarters, differenceInSeconds, differenceInWeeks, differenceInYears, eachDayOfInterval, eachMonthOfInterval, eachWeekOfInterval, eachWeekendOfInterval, eachWeekendOfMonth, eachWeekendOfYear, eachYearOfInterval, format, getDate, getDay, getDayOfYear, getDaysInMonth, getDaysInYear, getDecade, getHours, getISODay, getISOWeek, getISOWeekYear, getISOWeeksInYear, getMilliseconds, getMinutes, getMonth, getOverlappingDaysInIntervals, getQuarter, getSeconds, getTime, getUnixTime, getWeek, getWeekOfMonth, getWeekYear, getWeeksInMonth, getYear, isAfter, isBefore, isDate, isEqual, isExists, isFirstDayOfMonth, isFriday, isFuture, isLastDayOfMonth, isLeapYear, isMonday, isPast, isSameDay, isSameHour, isSameISOWeek, isSameISOWeekYear, isSameMinute, isSameMonth, isSameQuarter, isSameSecond, isSameWeek, isSameYear, isSaturday, isSunday, isThisHour, isThisISOWeek, isThisMinute, isThisMonth, isThisQuarter, isThisSecond, isThisWeek, isThisYear, isThursday, isToday, isTomorrow, isTuesday, isValid, isWednesday, isWeekend, isWithinInterval, isYesterday, parseISO }

const compareDates = (dateObj, dateRight) => {
  let result = false
  if (typeof dateObj === 'object') {
    if (dateObj['operator'] && dateObj['date']) {
      result = dateFns[dateObj['operator']](parseISO(dateObj['date']), parseISO(dateRight))
    } else {
      throw new TypeError('Invalid arguments for compareDates. Expects: { operator: functionName, date: ISOString }')
    }
  } else if (typeof dateObj === 'string') {
    result = isSameMonth(parseISO(dateObj), parseISO(dateRight))
  }
  return result
}

const key = pair => Object.keys(pair)[0]
const value = pair => Object.values(pair)[0]
const has = (obj, pair) => obj[key(pair)] === value(pair)
const getPair = (key, obj) => {
  const pair = {}
  pair[key] = obj[key]
  return pair
}

const contains = (obj, args, any) => {
  for (const arg in args) if (any ? has(obj, getPair(arg, args)) : !has(obj, getPair(arg, args))) return any
  return !any
}
const containsAtDate = (obj, args, date, any) => contains(obj, args, any) && (date ? compareDates(date, obj.date) : true)

const getItem = (objs, args, date, any) => {
  for (const obj of objs) if (containsAtDate(obj, args, date, any)) return obj
}

const getAll = (objs, args, date, any) => {
  const all = []
  for (const obj of objs) if (containsAtDate(obj, args, date, any)) all.push(obj)
  return all
}

const getAllById = (objs, ids, date, any) => {
  const all = []
  for (const id of ids) {
    const item = getItem(objs, { id: id }, date, any)
    if (item) all.push(item)
  }
  return all
}

const getAmount = (objs, args, date, any) => {
  let amount = 0
  for (const obj of objs) if (containsAtDate(obj, args, date, any)) amount += obj.amount
  return amount
}

const getRentRoll = (records, date) => getAmount(records, {category: 'Invoice', type: 'Rent'}, date)
const getRentCollected = (entries, date) => getAmount(entries, {category: 'Income', type: 'Rent'}, date)
const getLateFees = (entries, date) => getAmount(entries, {category: 'Income', type: 'Late Fee'}, date)
const getReimbursements = (entries, date) => getAmount(entries, {category: 'Expense', type: 'Reimbursement'}, date)
const getTenantRentOwed = (records, tenantId, date) => getAmount(records, {category: 'Invoice', type: 'Rent', tenant: tenantId}, date)
const getTenantRentEntry = (entries, tenantId, date) => getItem(entries, {category: 'Income', type: 'Rent', tenant: tenantId}, date)

const getPaymentProgress = (data, date) => {
  const rows = []
  for (const property of data.properties) {
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
  return rows
}

const getOutstandingRent = (data, date) => {
  let rows = []
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
  return rows
}

const getHistory = (data, dates) => {
  const history = []
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
  return history
}

const getSource = (data, date) => {
  const sources = []
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
  return sources
}

const getEarliestRecord = (data) => {
  let earliestRecord = new Date();
  for (const record of data.records) {
    if (isBefore(parseISO(record.date), earliestRecord)) earliestRecord = parseISO(record.date)
  }
  return earliestRecord
}

export {
  dateFns,
  getAll,
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
