let app = require('express')(),
    server = require('http').Server(app),
    bodyParser = require('body-parser')
    express = require('express'),
    cors = require('cors'),
    http = require('http'),
    path = require('path');

let test = require('./Routes/test')
let register = require('./Routes/user_authentication/new_user')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
    
app.use(cors());
app.use('/test', test)
app.use('/register_user',register)


app.use(function(req, res, next) {
    next();
});

/*first API to check if server is running*/
app.get('*', (req, res) => {
    res.send("working");
})


server.listen(3000, function() {
    console.log('app listening on port: 3000');
});