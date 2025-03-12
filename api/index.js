require('dotenv').config()

const express = require('express');
const app = express()

app.use(cors());

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Running on ${PORT}`)
})