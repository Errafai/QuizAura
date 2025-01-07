
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require("./server/config/db");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const PORT = 3001 || process.env.PORT;


/**DATABASE */
connectDB();

/**cookies and tokens*/
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());
app.use(
    session({
      secret: 'keyboard cat', // Change this to a secure secret in production
      resave: false, // Avoid resaving unchanged sessions
      saveUninitialized: false, // Only save sessions when something is stored
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
      }),
      cookie: {
        maxAge: 3600000, // 1 hour in milliseconds
        secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
        httpOnly: true, // Prevent client-side JavaScript from accessing cookies
      },
      rolling: true, // Reset cookie expiration time on every response
    })
  );

app.use(methodOverride('_method'));

/**template */
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.use(express.static('public'));


/**routing */
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/users"));
app.use("/", require("./server/routes/api"));
//app.use("/", require("./server/routes/quiz"));

app.listen(PORT, ()=>{
    console.log(`I'am listening on port ${PORT} ....`);
})