
/********************************** IMPORTS **********************************/

//EXPRESS and basic server imports
const express = require('express')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const ehbs = require('express-handlebars')

//PASSPORT-related imports
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//Encryption-related imports
const bCrypt = require('bCrypt')

//custom imports (routes, configs, mongoose)
const routes = require('./routes')
const extraConfigs = require('./extra-configs')
const dbControls = require('./db-controls')
const Users = require('./mongoose-models')

/**
 * Passport login authentication.
 * The submitted username and password are checked over the ones saved
 * in MongoDB. Any possible outcome is handled by the callback, which
 * sets the req.user for route handling.
 */
passport.use('login', new LocalStrategy(
  {
    passReqToCallback : true
  },
  function(req, username, password, callback) { 

    //MongoDB user existance check
    Users.findOne(
      { 
        'username' : username 
      }, 
      function(err, user) {

        //if there is an error, return the callback with it
        if (err) return callback(err)

        //if it does not exist, return the callback with false
        if (!user) { 
          console.log(`Could not find username: ${username}`)
          return callback(null, false,             
            console.log('msg:', 'Users not found!'))               
        }

        //wrong password, return cb with false
        if (!isCorrectPassword(user, password)) { 
          console.log('Wrong password!')
          return callback(null, false, 
            console.log('msg:', 'Wrong password!'))
        }

        //validation success, return callback with the user to set at req.user
        return callback(null, user)
      }
    )
  }
))

//function to compare the inputted password vs the encrypted one in MongoDB
const isCorrectPassword = function(user, password){
  return bCrypt.compareSync(password, user.password)
}

/**
 * Passport signup strategy.
 * The submitted username is contrasted against the ones in MongoDB.
 * If there was an error or the username matches one in it, then the
 * strategy will not pass through.
 * If the username is unique, the params passed in the request will
 * be saved inside MongoDB and the newly created user will be set up
 * for the session, effectively working as a successful login.
 */
passport.use('signup', new LocalStrategy(
  {
    passReqToCallback : true
  },
  function(req, username, password, callback) {

    makeOrRetrieveUser = function() {

      //first, attempt to find a username with the param name
      //inside MongoDB
      Users.findOne(
        {
          'username' : username
        },
        function(err, user) {

          //if there was an error in the search, return the callback with it
          if (err){
            console.log(`Signup error: ${err}`)
            return callback(err)
          }

          //if the user exists in the database, return the callback with false
          if (user) {
            console.log('Users already in existance')
            return callback(null, false, 
              console.log('msg:','Users already in existance'))
              
          } else {

            //proceed to user creation, using the mongoose model
            let newUser = new Users()
            newUser.username = username
            newUser.password = hashPassword(password)
            newUser.email = req.param('email')
            newUser.firstName = req.param('firstName')
            newUser.lastName = req.param('lastName')

            //save it in MongoDB
            newUser.save(function(err) {

              //if there was an error while saving, throw it
              if (err){
                console.log(`Error while saving user in DB: ${err}`)  
                throw err
              }

              //everything went ok, return the callback with the new user
              //to be set as request param
              console.log('Users created!')  
              return callback(null, newUser)
            })
          }
        }
      )
    }

    //wait for the event loop to execute the next tick and call for
    //the function we have just declared
    process.nextTick(makeOrRetrieveUser)
  }
))

//password hash generation using bCrypt
let hashPassword = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
}
   


/************* PASSPORT AUTHENTICATION ACROSS HTTP REQUESTS *************/

/**
 * Passport serializing function called with the user ID for authenticated
 * session persistance
 */
passport.serializeUser(function(user, callback) {
  callback(null, user._id)
})
 
/**
 * Passport deserializing function called with the user's MongoDB data searched
 * by his/her ID, also for authenticated session persistance
 */
passport.deserializeUser(function(id, callback) {
  Users.findById(id, function(err, user) {
    callback(err, user)
  })
})



/**************************** EXPRESS APP ****************************/

const app = express()

app.engine(
  '.hbs', 
  ehbs(
    {
      extname: '.hbs', 
      defaultLayout: 'main.hbs'
    }
  )
)

app.set('view engine', '.hbs')

app.use(express.static(__dirname + '/views'))

app.use(cookieParser())

app.use(bodyParser.urlencoded(
  {
    extended: true
  }
))

app.use(expressSession(
  {
    secret: 'Nothing comes to mind, honestly...',
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: extraConfigs.COOKIE_EXPIRATION
    },
    rolling: true,
    resave: true,
    saveUninitialized: false
  }
))


//Passport initalization and authentication restore
app.use(passport.initialize())
app.use(passport.session())


//Sniffer, if needed
app.use(function(req, res, next) {
    /*
    console.log('-- session --')
    console.log(req.session)
    console.log('-- headers --')
    console.log(req.headers.cookie)
    console.log('-------------')
    console.log('-- cookies --')
    console.log(req.cookies)
    console.log('-------------')
    console.log('-- signed cookies --')
    console.log(req.signedCookies)
    console.log('-------------')
    */
    next()
  })



/****************************** ROUTING ******************************/

/**
 * Function to check if the user is logged in. 
 * If he/she is, then continue. Else, redirect to the page to log in.
 */  
function isAlreadyLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      next()
  } 
  else {
      res.redirect('/login')
  }
}

// GET requests routing

app.get('/', routes.rootGET)
app.get('/login', routes.loginGET)
app.get('/loginfail', routes.loginFailGET)
app.get('/logout', routes.logoutGET)
app.get('/signup', routes.signupGET)
app.get('/signupfail', routes.signupFailGET)

/**
 * protected-path route emulates the access to pages only available if
 * the user is authenticated, and will only be available if the user is 
 * logged in or has just signed up.
 * The midware function isAlreadyLoggedIn checks that and allows the
 * access if so, or else it redirects to /login.
 * (Try accessing this path after logging in or signing up).
 */ 
app.get(
  '/protected-path', 
  isAlreadyLoggedIn,
  (req,res) => {
    let user = req.user
    res.send('User is logged in - PROTECTED ACCESS GRANTED')
  }
)

app.get('*', routes.missingPageGET)


/**
 * if the login authentication post request validates, Passport opens the
 * access to loginAFTER routing function. If the validation check fails, 
 * it will call for loginFailGET routing function.
 */
app.post(
  '/login', 
  passport.authenticate(
    'login', 
    { 
      failureRedirect: '/loginfail' 
    }
  ), 
  routes.loginAFTER
)

/**
 * Same as the post request for login, but while trying to signup.
 */
app.post(
  '/signup', 
  passport.authenticate(
    'signup', 
    { 
      failureRedirect: '/signupfail' 
    }
  ), 
  routes.signupAFTER
)



/************ DB CONNECTION AND SERVER PORT LISTENING **************/

let port = extraConfigs.PORT

dbControls.connectToDB(dbControls.DB_URL, err => {

  if(err) return console.log(`DB connection error: ${err}`)

  console.log('DB online!')

  app.listen(port, function(err) {

    if(err) return console.log(`Server listening error: ${err}`)
    console.log(`Up and running on port ${port}`)
  })
})
