let express = require('express'),
    router = express.Router(),
    async = require('async'),
    conn = require('../../mysql_config/cred');

var user={}
var userDet={}    

router.post('/google_auth', (req,res)=> {
    user = req.body
    console.log(req.body)
    var sql = `insert into user_login (googleId,user_name, firstName, lastName, photoUrl, email, provider) values 
               ('${user.googleId}','${user.user_name}','${user.firstName}','${user.lastName}','${user.photoUrl}','${user.email}','${user.provider}');`

    conn.query(sql, function(err, result, fields) {
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            res.send(JSON.stringify({ result: "passed" }))
        }

    });
})

router.post('/additional_details', (req,res)=> {
    userDet = req.body
    console.log(userDet)
   
   
    var check = false
    async.series([
        insertUserDetails,
        completeRegistration
    ], function(err, results) {

        console.log(results)
        //res.send("okay")
        if (results[0] && results[1] == true) check = true
                //console.log(check)

        if (check) res.send(JSON.stringify({ result: "passed" }))
        else res.send(JSON.stringify({ result: "failed" }))
            
    })
   
})

function insertUserDetails(callback){
    var sql = `insert into user_phone_details (googleId,phone_number,location) values ('${userDet.googleId}','${userDet.phone_number}','${userDet.location}');`
    
    conn.query(sql, function(err,result,fields){
        if (err) {
            console.log(err)
           
            callback(null, false)
        } else {
            console.log("true 1")
            callback(null, true)
           
        }
    })
}

function completeRegistration(callback){
    console.log(userDet.googleId)
    var sql = `update user_login set registration_completed = 'Y' where googleId='${userDet.googleId}';`
    conn.query(sql, function(err,result,fields){
        if (err) {
            console.log(err)
           
            callback(null, false)
            
        } else {
            console.log("true 2")
            callback(null, true)
            
        }
    })
}


module.exports = router;