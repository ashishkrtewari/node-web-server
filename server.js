const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

var serverStatus = "maintainence";
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method}  ${req.url}`;

    fs.appendFile('server.log', log + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log ', err);
        }
    })
    next();
})

app.use((req, res, next) => {
    if(serverStatus === "maintainence"){
        res.render('maintainence.hbs', {
            heading: "Website is Under Maintainence"
        })
    }
})

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

app.get('/', (req, res) => {
    res.render('home.hbs', {
        heading: "Welcome to our new homepage"
    })
})

app.get('/maintainence', (req, res) => {
    res.render('home.hbs', {
        heading: "Website is Under Maintainence"
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        heading: 'About us page'
    });
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "Unable to find Page"
    });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server up and running on ${port}`);
});