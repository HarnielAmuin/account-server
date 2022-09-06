//dotenv @config
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
/*@MongoDB SChema for password collections*/
const Pass = require('./model/schema')
/*@MongoDB Schema for admin password*/
const Admin = require('./model/passSchema')
/*Express function*/
const app = express();

app.use(cors()); //Cross Origin Resource Sharing
app.use(bodyParser.urlencoded({ extended: false })); //this is used for parsing the post data
app.use(bodyParser.json()); //this is used for reading json data format

/* MongoDb connection @URI */
function dbConnect() {
   const dbConnection = process.env.MONGODB_CONNECTION_URI;
   return dbConnection;
}

/* this will connect to database automatically */
mongoose.connect(dbConnect())
.then(() => console.log('Connected!'))
.catch(err => console.log(err))


app.post('/login', authUser, (req, res) => {

   const { Username, Password } = req.body.data;
   const logUser = { username: Username }
   const token = jwt.sign(logUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' }); //JWT sign using @ACCESS_TOKEN_SECRET
   res.json( { data: 'Valid', access: true, accessToken: token } ) //sending accesstoken to client for saving
   
})

/* this function will authenticate user before creating @JWT token */
async function authUser(req, res, next) {
   const { Username, Password } = req.body.data;
   const savedUserData = await Admin.find();
   const { client_id, password } = savedUserData[0];
   if(Username === client_id && Password === password) return next();
   return res.json({ data: 'Invalid Password', access: false })
}


app.get('/user', (req, res) => {

   const authHeader = req.headers['authorization']; //request headers
   const token = authHeader && authHeader.split(' ')[1]; //split authorization Bearer TOKEN
   if(token == null) return res.sendStatus(401); //check if null

   /*verify signed JWT token*/
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
     if(err) return res.send({ access: false })
     req.user = user
     res.send({ access: true, username: user.username })
   })

})

app.get('/api/files', (req, res) => {
   (async function files() {
      let mainData = []
      const data = await Pass.find()
      data.forEach(elem => {
        mainData.push(elem)
      })
      res.send({ mainData })
   })()
})

app.listen(process.env.PORT | 5000) //listening at port 5000