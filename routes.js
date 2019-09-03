/********************** REQUESTS ROUTING **********************/

function rootGET(req, res) {
}

function loginGET(req, res) {
  if (req.isAuthenticated()) {

    let user = req.user
    console.log('User logged in!')
    res.render('login-ok', {
      user: user.username,
      name: user.firstName,
      surname: user.lastName,
      email: user.email
    })
  }
  else {
    console.log('Fail to log in user')
    res.sendFile(__dirname + '/views/login.html')
  }
}

function signupGET(req, res) {
    res.sendFile(__dirname + '/views/signup.html')
}

function loginAFTER (req, res) {
  let user = req.user
  res.sendFile(__dirname + '/views/index.html')
}

function signupAFTER (req, res) {
  let user = req.newUser
  res.sendFile(__dirname + '/views/index.html')
}

function loginFailGET (req, res) {
  console.log('Login error!')
  res.render('login-error', {})
}

function signupFailGET (req, res) {
  console.log('Signup error!')
  res.render('signup-error', {})
}

function logoutGET (req, res) {
  req.logout()
  res.sendFile(__dirname + '/views/index.html')
}

function missingPageGET(req, res){
  res.status(404).render('routing-error', {})
}

module.exports = {
    rootGET,
    loginGET,
    loginFailGET,
    logoutGET,
    signupGET,
    signupFailGET,
    missingPageGET,
    loginAFTER,
    signupAFTER
}
