require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { GridFSBucket } = require('mongodb');
const app = express()
const connect = require('./db_connect');

app.use(cors());

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));


const ChatRoutes = require("./routes/upload");
app.use("/resources",require("./routes/resources"));
app.use("/quiz",require("./routes/quizGenRoute"));
app.use("/auth", require("./routes/Auth"));


const PORT = process.env.PORT;
(async () => {
  try {
      const db = await connect();
      const bucket = new GridFSBucket(db, {
          bucketName: 'uploads'
      });


      app.use('/api', ChatRoutes(db, bucket));      

      app.get("/", (req, res) => res.send("Working"));

      app.listen(PORT, () => {
          console.log(`server running on ${PORT}`);
      });
  } catch (error) {
      console.error('Error connecting to db:', error);
  }
})();