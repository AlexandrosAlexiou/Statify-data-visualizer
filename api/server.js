const express = require('express');
const path = require('path');
const server = express();
const mysql = require('mysql');
const cors = require('cors');
const logger = require('./middleware/logger');

const mysql_conf = require('./mysql.conf');
const con = mysql.createConnection(mysql_conf);

con.connect(err => {
  if (err) throw err;
  console.log(`[UPDATE]: Server is now connected with MySQL.`);
});

server.use(cors());
server.use(logger);

server.route('/api/timeline-chart:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  values=values.split('+');
  const country_code = values[0];
  const indicator_code = values[1];
  const period_value =values[2];
  const period=values[3];
  let query = `select measured.year,measured.measurement
    from(
            select years.year
            from years
            where ${period}=\'${period_value}\'
        )as wantedYears
    join
        (
            select *
            from measurements
            where country_code=\'${country_code}\' AND indicator_code=\'${indicator_code}\'
        )as measured
    on wantedYears.year=measured.year order by measured.year`;
  con.query(query, function (err, result) {
    if (err) throw err;
    res.send({result});
  });
});


server.route('/api/bar-chart:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  values=values.split('+');
  const country_code = values[0];
  const indicator_code = values[1];
  const period_value = values[2];
  const period = values[3];
  let query = `select ind1.Measurement,wantedYears.year,ind1.country_code
    from(
            select years.year
            from years
            where years.${period}=\'${period_value}\'
        )as wantedYears
    join(
            select measurements.Measurement,measurements.year,measurements.country_code
            from measurements
            where measurements.indicator_code =\'${indicator_code}\' AND measurements.country_code=\'${country_code}\'
            )as ind1
    on wantedYears.year=ind1.year order by wantedYears.year`;
  con.query(query, function (err, result) {
    if (err) throw err;
    res.send({result});
  });
});


server.route('/api/scatter-plot:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  values=values.split('+');
  const country_code = values[0];
  const indicator_code1 = values[1];
  const period_value = values[2];
  const period_type = values[3];
  let query = `select ind1.Measurement,ind1.indicator_code
    from(
            select years.year
            from years
            where years.${period_type}=\'${period_value}\'
        )as wantedYears
    join
        (
            select measurements.Measurement,measurements.year,measurements.country_code,measurements.indicator_code
            from measurements
            where measurements.indicator_code =\'${indicator_code1}\' AND measurements.country_code=\'${country_code}\'
        )as ind1
    on wantedYears.year=ind1.year`;
  con.query(query, function (err, result) {
    if (err) throw err;
    res.send({result});
  });
});


server.route('/api/countries').get( (req,res) => {
    let query = `select country_name from countries order by country_name;`;
    con.query(query, (err,result) => {
      if (err) throw err;
      res.send({result})
    })
  });


server.route('/api/indicators').get( (req,res) => {
  let query = `select indicator_name from indicators order by indicator_name;`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});


server.route('/api/spanfives').get( (req,res) => {
  let query = `select DISTINCT years.five_yr_period from years`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});


server.route('/api/spantens').get( (req,res) => {
  let query = `select DISTINCT years.ten_yr_period from years`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});


server.route('/api/spantwenties').get( (req,res) => {
  let query = `select DISTINCT years.twenty_yr_period from years`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});


server.route('/api/indicator_code:indicator_name').get( (req,res) => {
  let value = req.params['indicator_name'];
  value = value.substring(1);
  let query = `select indicator_code from indicators where indicators.indicator_name = '${value}'`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});


server.route('/api/country_code:country_name').get( (req,res) => {
  let value = req.params['country_name'];
  value = value.substring(1);
  let query = `select country_code from countries where country_name = '${value}'`;
  con.query(query, (err,result) => {
    if (err) throw err;
    res.send({result})
  })
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') server.use('/', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
server.listen(port, err => {
  if (err) {
    return console.log(err)
  }
  console.log(`[UPDATE]: Listening on port ${port}...`);
});
