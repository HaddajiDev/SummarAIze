require('dotenv').config()

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express()

app.use(cors());

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use("/course", require("./routes/Generate_Course"))

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Running on ${PORT}`)
})