const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const HackerStory = require('./models');

mongoose.Promise = global.Promise;

const DATABASE_URL = process.env.DATABASE_URL ||
                     global.DATABASE_URL ||
                     'mongodb://localhost/hackernews';
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());


HackerStory.find().then(function(data){
  console.log('Outer Find',data);
});

// API endpoints go here

app.get('/story', function(req, res){
  HackerStory.find().then(function(data){
    res.json(data);
  });
});

app.get('/stories', function(req, res) {
  HackerStory
    .find()
    .sort({votes: -1})
    .limit(20)
    .exec()
    .then(function(data) {
      res.json(data);
    //  console.log(HackerStorys);
    //  res.status(200).json({HackerStory: HackerStorys.map((HackerStory) => HackerStory.apiRepr())
    //  });
    });
  });



let server;
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};