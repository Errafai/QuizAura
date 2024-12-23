
const express = require('express');
const ejs = require('ejs');
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

/**template */
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');

app.get("/", (req, res)=>{
    res.render("home");
})

app.get("/games", (req, res)=>{
    res.render("games");
})

app.listen(3000, ()=>{
    console.log("I'am listening on port 3000 ....");
    
})