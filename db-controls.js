/********************** MONGOOSE MongoDB handlers **********************/

const DB_URL = 'mongodb://localhost:27017/passport'

const mongoose = require('mongoose')

var DBOnline = false

function connectToDB(url, cb) {

  mongoose.connect(url, 
    { 
      useNewUrlParser: true 
    }, 
    err => {

      if(!err) {
        DBOnline = true
      }

      if(cb != null) {
        cb(err)
      }
  })
}

module.exports = {
  DB_URL,
  connectToDB
}