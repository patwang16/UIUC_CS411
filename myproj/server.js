var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.171.125.235',
                user: 'root',
                password: 'aussiedogs1234',
                database: 'aussiedogs'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { "title": 'Aussie Dogs' , data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
});

app.get('/success', function(req, res) {
      res.send({'message': 'Action finished successfully!'});
});
 
// this code is executed when a user clicks the form submit button
app.post('/create', function(req, res) {
  var newreferenceid = req.body.newreferenceid;
  var newdogname = req.body.newdogname;
  var newbreed = req.body.newbreed;
  var suburb = req.body.suburb;
  var birthyear = req.body.birthyear;
  var gender = req.body.gender;
  var newlatitude = req.body.newlatitude;
  var newlongitude = req.body.newlongitude;
  var sql = `INSERT INTO Dog (ReferenceID, Animal_Name, Breed, Suburb, BirthYear, Gender, Latitude, Longitude) VALUES ('${newreferenceid}','${newdogname}','${newbreed}','${suburb}','${birthyear}','${gender}','${newlatitude}','${newlongitude}')`;



//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.post('/read', function(req, res) {
  var referenceid = req.body.referenceid;
  var dogname = req.body.dogname;
  var breed = req.body.breed;
  
  var sql = `SELECT * FROM Dog WHERE ReferenceID LIKE '%${referenceid}%' OR Animal_Name LIKE '%${dogname}%' OR Breed LIKE '%${breed}%' LIMIT 15`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }

//    for (let i = 0; i < result.length;i++){
//	console.log(result[i]);
//    }
    res.render('index',{data: result, old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
  });
});

app.post('/check', function(req, res) {
  var up_referenceid = req.body.up_referenceid;
   
  var sql = `SELECT * FROM Dog WHERE ReferenceID LIKE '%${up_referenceid}%' LIMIT 1`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('index',{data:[], old_entry:result, todelete:[], adv_q1:[], adv_q2:[]});
  });
});

app.post('/update', function(req, res) {
  var validreferenceid = req.body.validreferenceid;
  var up_dogname = req.body.up_dogname;
  var up_breed = req.body.up_breed;
  var up_suburb = req.body.up_suburb;
  var up_birthyear = req.body.up_birthyear;
  var up_gender = req.body.up_gender;
  var up_latitude = req.body.up_latitude;
  var up_longitude = req.body.up_longitude;
  
  var sql = `UPDATE Dog a SET  a.Animal_Name = '${up_dogname}', a.Breed = '${up_breed}', a.Suburb = '${up_suburb}', a.BirthYear = '${up_birthyear}', a.Gender = '${up_gender}', a.Latitude = '${up_latitude}', a.Longitude = '${up_longitude}' WHERE a.ReferenceID = '${validreferenceid}' AND b.ReferenceID = '${validreferenceid}'`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.post('/check_del', function(req, res) {
  var del_referenceid = req.body.del_referenceid;
   
  var sql = `SELECT * FROM Dog WHERE ReferenceID LIKE '%${del_referenceid}%' LIMIT 1`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('index',{data:[], old_entry:[], todelete:result, adv_q1:[], adv_q2:[]});
  });
});

app.post('/delete', function(req, res) {
  var ripreferenceid = req.body.ripreferenceid;
   
  var sql = `DELETE FROM Dog WHERE ReferenceID = '${ripreferenceid}'`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});

app.post('/adv1', function(req, res) {
  var adv1breed = req.body.adv1breed;
   
  var sql = `Select Suburb, Count(*) as DogCount FROM Dog Where Breed LIKE '%${adv1breed}%' GROUP BY Suburb HAVING DogCount >= (SELECT AVG(towndog) FROM (SELECT Count(*) AS towndog FROM Dog WHERE Breed LIKE '%${adv1breed}%' GROUP BY Suburb) AS Inter) ORDER BY DogCount DESC LIMIT 15`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('index',{data:[], old_entry:[], todelete:[], adv_q1:result, adv_q2:[]});
  });
});

app.post('/adv2', function(req, res) {
  var building1 = req.body.building1;
  var building2 = req.body.building2;
   
  var sql = `SELECT Neighborhood.name as Neighborhood FROM Neighborhood JOIN Building ON Neighborhood.Town = Building.Town WHERE Building.Type LIKE '%${building1}%' OR Building.Type LIKE '%${building2}%' AND Neighborhood.Town = ANY(SELECT Town.TownName FROM Town JOIN Neighborhood ON (Town.TownName= Neighborhood.Town) GROUP BY Town.TownName HAVING Count(*)>75) LIMIT 15`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('index',{data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:result});
  });
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

