const express = require('express')
const app = express()
const PORT = procces.env.PORT || 3000
const router = require('./routes/index')
const session = require('express-session')

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: true 
  }
}))

app.use('/', router)

app.listen(PORT, ()=>{
  console.log(`Listening on http://localhost:${PORT}`);
})