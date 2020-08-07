let app = require('express')(),
    server = require('http').Server(app),
    bodyParser = require('body-parser')
    express = require('express'),
    cors = require('cors'),
    http = require('http'),
    path = require('path');

let test = require('./Routes/test')
let register = require('./Routes/user_authentication/new_user')
let login_user = require('./Routes/user_authentication/login')
let gymList = require('./Routes/Gym_details/gymList')
let gymSlots = require('./Routes/Gym_details/gymSlots')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
    
app.use(cors());
app.use('/test', test)
app.use('/register_user',register)
app.use('/authorize_user',login_user)
app.use('/getGyms',gymList)
app.use('/getGym',gymSlots)

app.use(function(req, res, next) {
    next();
});

app.use('/images/GymImages', express.static(__dirname+'/Assets/'))

/*first API to check if server is running*/
app.get('*', (req, res) => {
    res.send("working");
})


server.listen(3000, function() {
    console.log('app listening on port: 3000');
});