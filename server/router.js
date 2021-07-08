const express = require('express');
const router = express.Router();
const Database = require('./Database');
const queries = require('./queries');

router.get('/data', async (req, res) => {
  const database = new Database();
  let rows = {};

  if (req.query.table) {
    // TODO: escape user input
    rows = await database.query(`SELECT * FROM ${req.query.table}`);
  }

  if (req.query.fields) {
    const date = req.query.date || Date.now();
    const fields = req.query.fields.split(',');

    for (const field of fields) {
      if (field === 'earliest-record') {
        const result = await database.query(queries.earliestRecord);
        rows.earliestRecord = result[0].earliestrecord;
      }
      if (field === 'rent-roll') {
        const result = await database.query(queries.rentRoll(date));
        rows.rentRoll = result[0].rentroll;
      }
      if (field === 'rent-collected') {
        const result = await database.query(queries.rentCollected(date));
        rows.rentCollected = result[0].rentcollected;
      }
      if (field === 'late-fees') {
        const result = await database.query(queries.lateFees(date));
        rows.lateFees = result[0].latefees;
      }
      if (field === 'reimbursements') {
        const result = await database.query(queries.reimbursements(date));
        rows.reimbursements = result[0].reimbursements;
      }
      if (field === 'payment-timeline') rows.paymentTimeline = await database.query(queries.paymentTimeline(date));
      if (field === 'payment-sources')  rows.paymentSources  = await database.query(queries.paymentSources(date));
      if (field === 'payment-progress') rows.paymentProgress = await database.query(queries.paymentProgress(date));
      if (field === 'outstanding-rent') rows.outstandingRent = await database.query(queries.outstandingRent(date));
    }
  }

  await database.close();
  res.set({
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT',
    'Access-Control-Allow-Credentials' : true,
    'Content-Type': 'application/json',
  });
  res.json(rows);
});

module.exports = router;

