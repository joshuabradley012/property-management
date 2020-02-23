const getRentRoll = ({records}, date) => {
  let rentRoll = 0
  for (const [recordId, record] of Object.entries(records)) {
    if (record.category === 'Invoice' && record.type === 'Rent' && record.date.due.year === date.year && record.date.due.month === date.month) rentRoll += record.amount
  }
  return rentRoll
}

const getRentCollected = ({entries}, date) => {
  let paid = 0
  for (const [entryId, entry] of Object.entries(entries)) {
    if (entry.category === 'Income' && entry.type === 'Rent' && entry.date.year === date.year && entry.date.month === date.month) paid += entry.amount
  }
  return paid
}

const getLateFees = ({entries}, date) => {
  let fee = 0
  for (const [entryId, entry] of Object.entries(entries)) {
    if (entry.category === 'Income' && entry.type === 'Late Fee' && entry.date.year === date.year && entry.date.month === date.month) fee += entry.amount
  }
  return fee
}

const getPaymentProgress = (data, date) => {
  const rows = []
  for (const [propertyId, property] of Object.entries(data)) {
    const rentRoll = getRentRoll(property.account, date)
    const collected = getRentCollected(property.account, date)
    const due = rentRoll - collected
    rows.push({
      address: property.propertyInfo.address,
      rentRoll: rentRoll,
      collected: collected,
      due: due,
    })
  }
  return rows
}

const getTenantRentOwed = ({records}, tenantId, date) => {
  let owed = 0
  for (const [recordId, record] of Object.entries(records)) {
    if (record.tenantId === tenantId && record.category === 'Invoice' && record.type === 'Rent' && record.date.due.year === date.year && record.date.due.month === date.month) owed += record.amount
  }
  return owed
}

const getTenantRentEntry = ({entries}, tenantId, date) => {
  let rentEntry = {}
  for (const [entryId, entry] of Object.entries(entries)) {
    if (entry.tenantId === tenantId && entry.category === 'Income' && entry.type === 'Rent' && entry.date.year === date.year && entry.date.month === date.month) {
      rentEntry = entry
    }
  }
  return rentEntry
}

const getTenantsOutstandingRent = ({account, tenants}, date) => {
  const outstandingRent = []
  for (const [tenantId, tenant] of Object.entries(tenants)) {
    const rentEntry = getTenantRentEntry(account, tenantId, date)
    const rentOwed = getTenantRentOwed(account, tenantId, date)
    const rentPaid = rentEntry.amount || 0
    const balance = rentOwed - rentPaid
    const status = (balance > 0) ? 'Unpaid' : rentPaid ? 'Paid' : '–'
    const source = rentEntry.source ? rentEntry.source : status === 'Paid' && rentPaid ? 'Other' : '–'
    const lastPayment = rentEntry.date ? [rentEntry.date.year, rentEntry.date.month, rentEntry.date.day].join('-') : '–'
    outstandingRent.push({
      name: tenant.tenantInfo.name,
      status: status,
      balance: balance,
      paid: rentPaid,
      source: source,
      lastPayment: lastPayment,
    })
  }
  return outstandingRent
}

const getOutstandingRent = (data, date) => {
  let rows = []
  for (const [propertyId, property] of Object.entries(data)) {
    rows = rows.concat(getTenantsOutstandingRent(property, date))
  }
  return rows
}

export {
  getRentRoll,
  getRentCollected,
  getLateFees,
  getPaymentProgress,
  getTenantRentOwed,
  getTenantRentEntry,
  getOutstandingRent,
}
