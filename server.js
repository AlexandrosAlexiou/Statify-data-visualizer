const express = require('express');
const server = express();
const mysql = require('mysql');
const cors = require('cors');

server.use(cors());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "StatisticsDB"
});

con.connect(function(err) {
  if (err) throw err;
  console.log(`[UPDATE]:Server is now connected with MySQL.`);
});


server.route('/api/timeline:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  values=values.split('+');
  var country_code = values[0];
  var indicator_code = values[1];;
  var period_value =values[2];
  var period=values[3];
  let query = `select measured.country_code,measured.Measurement,measured.year
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
    on wantedYears.year=measured.year`;
  //debugger
  con.query(query, function (err, result) {
    if (err) throw err;
    res.send({result});
    console.log('[UPDATE]: values just transferred to the frontend server.')
  });
});

server.route('/api/barchart:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  var vals=values.split('+');
  var country_code=vals[0];
  var indicator_code = vals[1];;
  var period_value =vals[2];
  var period=vals[3];
  console.log('Barchart values: '+country_code+indicator_code+period_value+period);
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
    on wantedYears.year=ind1.year`;
  con.query(query, function (err, result) {
    if (err) throw err;
    res.send({result});
    console.log('[UPDATE]: values just transferred to the frontend server.')
  });
});

server.route('/api/scatterplot:values').get((req, res) => {
  let values = req.params['values'];
  values = values.substring(1);
  var vals=values.split('+');
  var country_code=vals[0];
  var indicator_code1 = vals[1];
  var indicator_code2 = vals[2];
  var period_value =vals[3];
  var period_type=vals[4];
  let query = `select ind1.Measurement,ind1.indicator_code,ind2.Measurement,ind2.indicator_code
    from(
            select years.year
            from years
            where ${period_type}=\'${period_value}\'
        )as wantedYears
    join
        (
            select measurements.Measurement,measurements.year,measurements.country_code,measurements.indicator_code
            from measurements
            where indicator_code =\'${indicator_code1}\' AND country_code=\'${country_code}\'
        )as ind1
    on wantedYears.year=ind1.year
    join
        (
            select measurements.Measurement,measurements.year,measurements.country_code,measurements.indicator_code
            from measurements
            where indicator_code=\'${indicator_code2}\' AND country_code=\'${country_code}\'
        )as ind2
    on ind1.year=ind2.year`
  con.query(query, function (err, result) {
    console.log(result);
    if (err) throw err;
    res.send({result});
    console.log('[UPDATE]: values just transferred to the frontend server.')
  });
});


const port = process.env.PORT || 3000;
server.listen(port, err => {
  if(err){
    return console.log(err)
  }
  console.log(`[UPDATE]:Listening on port ${port}...`);
  console.log(`Timeline queries at: http://localhost:3000/api/timeline:GRC+SP.POP.2024.FE.5Y+2000-2004+5yr_period`);
  console.log(`Barchart queries at: http://localhost:3000/api/barchart:GRC+SP.POP.2024.FE.5Y+2000-2004+5yr_period`);
  console.log(`Scatterplot queries at: http://localhost:3000/api/scatterplot:GRC+EG.ELC.FOSL.ZS+SP.POP.2024.FE.5Y+2000-2004+5yr_period`);
});
