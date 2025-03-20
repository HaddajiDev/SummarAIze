require('dotenv').config()
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { GridFSBucket } = require('mongodb');
const cookieParser = require('cookie-parser');


const connect = require('./lib/db');

const PORT = process.env.PORT;

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://summar-ai-ze.vercel.app"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));


const ChatRoutes = require("./routes/upload");
app.use("/resources",require("./routes/resources"));
app.use("/quiz",require("./routes/quizGenRoute"));
app.use("/auth", require("./routes/Auth"));


(async () => {
  try {
    await connect.connectMongoose();
    const db = await connect.connectClient();
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