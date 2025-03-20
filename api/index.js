require('dotenv').config()
const express = require('express');
// const session = require('express-session');
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
app.options("*", cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(cookieParser());
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));


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