const dateParts = (dateString) => {
  let date = new Date(Date.now());
  if (dateString && Date.parse(dateString)) date = new Date(dateString);
  return date.toISOString().split('T')[0].split('-').map(val => parseInt(val));
}

exports.earliestRecord = `
  SELECT MIN(date) AS "earliestRecord"
    FROM records
`;

exports.rentRoll = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT SUM(records.amount) AS "rentRoll"
    FROM records
   WHERE EXTRACT(MONTH FROM records.date) = ${month}
     AND EXTRACT(YEAR FROM records.date) = ${year}
     AND records.type = 'Rent'
`};

exports.rentCollected = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT SUM(entries.amount) AS "rentCollected"
    FROM entries
   WHERE EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Rent'
`};

exports.lateFees = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT SUM(entries.amount) AS "lateFees"
    FROM entries
   WHERE EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Late Fee'
`};

exports.reimbursements = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT SUM(entries.amount) AS reimbursements
    FROM entries
   WHERE EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Reimbursement'
`};

exports.paymentTimeline = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT entries.date AS name,
         SUM(entries.amount) AS collected,
         (SELECT SUM(records.amount) AS "rentRoll"
            FROM records
           WHERE EXTRACT(MONTH FROM records.date) = ${month}
             AND EXTRACT(YEAR FROM records.date) = ${year}
             AND records.type = 'Rent'
         ) AS due
    FROM entries
   WHERE EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Rent'
   GROUP
      BY entries.date
   ORDER
      BY entries.date
`};

exports.paymentSources = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT entries.source AS name,
         SUM(entries.amount) AS value
    FROM entries
   WHERE EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Rent'
   GROUP
      BY entries.source
`};

exports.paymentProgress = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT properties.id,
         properties.name,
         SUM(records.amount) AS "rentRoll",
         SUM(entries.amount) AS collected,
         SUM(records.amount) - SUM(entries.amount) AS due
    FROM properties
    LEFT
    JOIN buildings
      ON buildings."propertyId" = properties.id
    LEFT
    JOIN units
      ON units."buildingId" = buildings.id
    LEFT
    JOIN tenants
      ON tenants."unitId" = units.id
    LEFT
    JOIN people
      ON people.id = tenants."personId"
    LEFT
    JOIN records
      ON records."personId" = people.id
     AND EXTRACT(MONTH FROM records.date) = ${month}
     AND EXTRACT(YEAR FROM records.date) = ${year}
     AND records.type = 'Rent'
    LEFT
    JOIN entries
      ON entries."recordId" = records.id
     AND EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Rent'
   GROUP
      BY properties.id
`};

exports.outstandingRent = (dateString) => {
  const [year, month] = dateParts(dateString);
  return `
  SELECT tenants.id,
         people.name,
         CASE
           WHEN SUM(records.amount) - SUM(entries.amount) = 0
           THEN 'Paid'
           ELSE 'Unpaid'
         END AS status,
         SUM(records.amount) - SUM(entries.amount) AS balance,
         SUM(entries.amount) AS paid,
         entries.source,
         entries.date AS "lastPayment"
    FROM tenants
    LEFT
    JOIN people
      ON people.id = tenants."personId"
    LEFT
    JOIN records
      ON records."personId" = people.id
     AND EXTRACT(MONTH FROM records.date) = ${month}
     AND EXTRACT(YEAR FROM records.date) = ${year}
     AND records.type = 'Rent'
    LEFT
    JOIN entries
      ON entries."recordId" = records.id
     AND EXTRACT(MONTH FROM entries.date) = ${month}
     AND EXTRACT(YEAR FROM entries.date) = ${year}
     AND entries.type = 'Rent'
   GROUP
      BY tenants.id,
         people.name,
         entries.source,
         entries.date
`};

