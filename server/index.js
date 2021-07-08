const express = require('express');
const path = require('path');
const router = require('./router');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '../', '.env.development') });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(router);

const port = process.env.PORT ? process.env.PORT : 8081;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
