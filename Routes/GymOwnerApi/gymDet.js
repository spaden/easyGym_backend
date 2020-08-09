let express = require('express'),
    router = express.Router(),
    async = require('async'),
    conn = require('../../mysql_config/cred');



router.post("/",(req,res)=> {
    var dat = req.body
    var sql = `select * from  current_bookings_on_hold where gymId = ${dat.gymId} and status='P'`
    //console.log(dat)
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            //console.log(data)
            res.send(JSON.stringify({ result: "passed",data: data  }))
        }
    })
})

router.post("/updateCurrentBookings",(req,res)=> {
    var dat = req.body
    var sql = `update current_bookings_on_hold set status='${dat.status}' where id=${dat.id};`
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            res.send(JSON.stringify({ result: "passed"}))
        }
    })
    
})



module.exports = router;