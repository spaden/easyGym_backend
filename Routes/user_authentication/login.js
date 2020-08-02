let express = require('express'),
    router = express.Router(),
    async = require('async'),
    conn = require('../../mysql_config/cred');

user={}

router.post('/',(req,res)=> {
    user = req.body
    var sql = `select registration_completed from user_login where googleId = '${user.googleId}';`

    conn.query(sql, function(err, result, fields) {
        if (err) {
            console.log(result)
            res.send(JSON.stringify({ result: "failed" }))

        } else {

            if (result.length == 1) {
                console.log(result)
                res.send(JSON.stringify({ result: "passed", registration_completed: result[0].registration_completed}))
            } else {
                console.log(result)
                res.send(JSON.stringify({ result: "failed" }))
            }

        }
    });
})






module.exports = router;