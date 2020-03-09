import {
  isWithinInterval,
  parseISO
} from 'date-fns'

// const isEmpty = obj => Object.entries(obj).length === 0 && obj.constructor === Object
// const has = (obj, [key, value]) => obj[key] === value
// const hasAll = (obj, args) => Object.entries(args).evey(([key, value]) => has(obj, [key, value]))
// const hasAny = (obj, args) => Object.entries(args).some(([key, value]) => has(obj, [key, value]))
// const getItem = (arr, args) => arr.find(item => item.hasAll(args))
// const getItems = (arr, args) => arr.filter(item => item.hasAll(args))
// const getItemWithAny = (arr, args) => arr.find(item => item.hasAny(args))
// const getItemsWithAny = (arr, args) => arr.filter(item => item.hasAny(args))
// const getTotal = (arr, args) => arr.reduce((total, item) => total += item.amount, 0)
// const getRentRollRecords = records => getItems(records, {category: 'Invoice', type: 'Rent'})
// const getRentEntries = entries => getItems(entries, {category: 'Income', type: 'Rent'})
// const getLateFeeEntries = entries => getItems(entries, {category: 'Income', type: 'Late Fee'})
// const getReimbursementEntries = entries => getItems(entries, {category: 'Expense', type: 'Reimbursement'})
// const getTenantRentEntry = (entries, tenantId) => getItems(entries, {category: 'Income', type: 'Rent', tenant: tenantId})
// const getTenantRentRecord = (records, tenantId) => getItems(records, {category: 'Invoice', type: 'Rent', tenant: tenantId})

class BaseObject {
  constructor(props) {
    Object.assign(this, props)
  }

  set(props) {
    return Object.assign(this, props)
  }

  isEmpty() {
    return Object.entries(this).length === 0
  }
}

class Item extends BaseObject {
  constructor(props) {
    super(props)
  }

  has(key, value) {
    return this[key] === value
  }

  hasAll(args) {
    return Object.entries(args).every(([key, value]) => this.has(key, value))
  }

  hasAny(args) {
    return Object.entries(args).some(([key, value]) => this.has(key, value))
  }
}

class Items extends Array {
  constructor(props) {
    super()
    Object.assign(this, props)
  }

  setItems(props) {
     return Object.assign(this, props.map(element => new Item(element)))
  }

  getItem(args) {
    return this.find(item => item.hasAll(args))
  }

  getItems(args) {
    return this.filter(item => item.hasAll(args))
  }

  getItemWithAny(args) {
    return this.find(item => item.hasAny(args))
  }

  getItemsWithAny(args) {
    return this.filter(item => item.hasAny(args))
  }
}

class TransactionRecords extends Items {
  getTransactionsInDateRange(dateRange) {
    return this.filter(item => isWithinRange(item.date, dateRange))
  }

  getTotal() {
    return this.reduce((total, item) => total += item.amount, 0)
  }

  getRentRollRecords() {
    return this.getItems({category: 'Invoice', type: 'Rent'})
  }

  getRentEntries() {
    return this.getItems({category: 'Income', type: 'Rent'})
  }

  getLateFeeEntries() {
    return this.getItems({category: 'Income', type: 'Late Fee'})
  }

  getReimbursementEntries() {
    return this.getItems({category: 'Expense', type: 'Reimbursement'})
  }

  getTenantRentEntries(tenantId) {
    return this.getItems({category: 'Income', type: 'Rent', tenant: tenantId})
  }

  getTenantRentRecords(tenantId) {
    return this.getItems({category: 'Invoice', type: 'Rent', tenant: tenantId})
  }
}

class Data extends BaseObject {
  setData(props) {
    const data = {}
    Object.entries(props).map(([key, value]) => {
      switch (key) {
        case 'entries':
        case 'records':
          data[key] = new TransactionRecords(value)
          break
        default:
          data[key] = new Items(value)
      }
    })
    return Object.assign(this, data)
  }
}

const isData = obj => obj.constructor.name !==  'Data'
const initializeData = data => {
  if (!isData(data)) {
    try {
      data = new Data().setData(data)
    } catch (e) {
      console.error('Failed to make new Data(): ' + e);
    }
  }
  return data
}

export {
  Data,
  initializeData,
  isData,
}
