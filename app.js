
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require("./server/config/db");
const session = require('express-session');
const MongoStore = require('connect-mongo');

const PORT = 3000 || process.env.PORT;

/**DATABASE */
connectDB();

/**cookies and tokens*/
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieParser());
app.use(session(
    {
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
          mongoUrl: process.env.MONGODB_URI 
        })
    },
 
    //cookie: {maxAge: new Date {Date.now() + (3600000)}}
));



/**template */
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.use(express.static('public'));


/**routing */
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/users"));


app.listen(PORT, ()=>{
    console.log(`I'am listening on port ${PORT} ....`);
})