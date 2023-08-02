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

app.get('/vis', function(req, res) {
  res.render('graphs', { vis_1:0, vis_2:0, vis_3:0, town_name:'Town'});
});

app.post('/home', function (req, res) {
 res.redirect('/');
});

app.get('/register', function (req, res) {
 res.render('register', { "title": 'Aussie Dogs' , data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
});

app.get('/up', function (req, res) {
 res.render('update', {old_entry:[]});
});

app.get('/del', function (req, res) {
 res.render('deletion', { "title": 'Aussie Dogs' , data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
});

app.get('/adv1', function (req, res) {
 res.render('adv_query1', { "title": 'Aussie Dogs' , data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
});

app.get('/adv2', function (req, res) {
 res.render('adv_query2', { "title": 'Aussie Dogs' , data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
});

app.get('/stored', function (req, res) {
 res.render('rankings', { ranked:[]});
});

app.get('/success', function(req, res) {
      res.render('success');
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
  var town_special = (SELECT TownName, SUM(IF(Type LIKE 'Park%',1,0)) AS NumParks, SUM(IF(Type LIKE 'Clinic%',1,0)) AS NumClinics, SUM(IF(Type LIKE '%Store%',1,0)) AS NumStores FROM Town JOIN Building ON (Town.TownName = Building.Town) GROUP BY TownName);


//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
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
      res.render('error',{message:err});
      return;
    }
    res.render('index',{data: result, old_entry:[], todelete:[], adv_q1:[], adv_q2:[]});
  });
});

app.post('/check', function(req, res) {
  var up_referenceid = req.body.up_referenceid;
   
  var sql = `SELECT * FROM Dog WHERE ReferenceID LIKE '%${up_referenceid}%' LIMIT 1`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    res.render('update',{data:[], old_entry:result, todelete:[], adv_q1:[], adv_q2:[]});
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
  
  var sql = `UPDATE Dog a SET  a.Animal_Name = '${up_dogname}', a.Breed = '${up_breed}', a.Suburb = '${up_suburb}', a.BirthYear = '${up_birthyear}', a.Gender = '${up_gender}', a.Latitude = '${up_latitude}', a.Longitude = '${up_longitude}' WHERE a.ReferenceID = '${validreferenceid}'`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
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
      res.render('error',{message:err});
      return;
    }
    res.render('deletion',{data:[], old_entry:[], todelete:result, adv_q1:[], adv_q2:[]});
  });
});

app.post('/delete', function(req, res) {
  var ripreferenceid = req.body.ripreferenceid;
   
  var sql = `DELETE FROM Dog WHERE ReferenceID = '${ripreferenceid}'`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    res.redirect('/success');
  });
});

app.post('/adv1', function(req, res) {
  var adv1breed = req.body.adv1breed;
   
  var sql = `Select Suburb, Count(*) as DogCount FROM Dog Where Breed LIKE '${adv1breed}%' GROUP BY Suburb HAVING DogCount >= (SELECT AVG(towndog) FROM (SELECT Count(*) AS towndog FROM Dog WHERE Breed LIKE '${adv1breed}%' GROUP BY Suburb) AS Inter) ORDER BY DogCount DESC LIMIT 15`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    res.render('adv_query1',{data:[], old_entry:[], todelete:[], adv_q1:result, adv_q2:[]});
  });
});

app.post('/adv2', function(req, res) {
  var building1 = req.body.building1;
  var building2 = req.body.building2;
   
  var sql = `SELECT Neighborhood.name as Neighborhood FROM Neighborhood JOIN Building ON Neighborhood.Town = Building.Town WHERE Building.Type LIKE '%${building1}%' OR Building.Type LIKE '%${building2}%' AND Neighborhood.Town = ANY(SELECT Town.TownName FROM Town JOIN Neighborhood ON (Town.TownName= Neighborhood.Town) GROUP BY Town.TownName HAVING Count(*)>75) LIMIT 15`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    //console.log(result);
    res.render('adv_query2',{data:[], old_entry:[], todelete:[], adv_q1:[], adv_q2:result});
  });
});

app.post('/rank', function(req, res) {
  var sql = `CALL Rankings()`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    //console.log(result[0]);
    res.render('rankings',{ranked:result[0]});
  });
});

app.post('/graph', function(req, res) {
  var town = req.body.graph_town;
  
  var sql = `SELECT TownName, SUM(IF(Type LIKE 'Park%',1,0)) AS NumParks, SUM(IF(Type LIKE 'Clinic%',1,0)) AS NumClinics, SUM(IF(Type LIKE '%Store%',1,0)) AS NumStores FROM Town JOIN Building ON (Town.TownName = Building.Town) WHERE TownName=${town} GROUP BY TownName`;

//console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.render('error',{message:err});
      return;
    }
    //console.log(result[0]);
    res.render('graphs', { vis_1:result[1], vis_2:result[2], vis_3:result[3], town_name:result[0]});
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});

