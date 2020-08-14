let express = require('express'),
    router = express.Router();
    conn = require('../../mysql_config/cred');



    router.post("/availableslots",(req,res)=> {
        var data = req.body
        var sql = `select * from gymSLOTS where gymID= ${data.gymID};`
        conn.query(sql,function(err,data,fields){
            if (err) {
                console.log(err)
                res.send(JSON.stringify({ result: "failed" }))
            } else {
                console.log("true 1")
                res.send(JSON.stringify({ result: "passed",data: data  }))
            }
        })
    })

    router.post("/checkAndHoldSlot",(req,res)=>{
        var data = req.body
        console.log(data)
        var sql = `start transaction;
        select * from gymSLOTS  where gymId=${data.gymId} for update;
        update gymSLOTS set ${data.slot} = ${data.slot}-1  where gymId=${data.gymId} and ${data.slot}>=1;
        commit;`
        
        
        conn.query(sql,function(err,data,fields){
            if (err) {
                console.log(err)
                res.send(JSON.stringify({ result: "failed" }))
            } else {
                console.log("Slot booked")
                res.send(JSON.stringify({ result: "passed",data: data  }))
            }
        })
    })

    router.post("/cancelHeldSlot",(req,res)=>{
        var data = req.body
        console.log(data)
        var sql = `start transaction;
        select * from gymSLOTS  where gymId=${data.gymId} for update;
        update gymSLOTS set ${data.slot} = ${data.slot}+1  where gymId=${data.gymId} and ${data.slot}>=1;
        commit;`
        
        
        conn.query(sql,function(err,data,fields){
            if (err) {
                console.log(err)
                res.send(JSON.stringify({ result: "failed" }))
            } else {
                console.log("Slot booked")
                res.send(JSON.stringify({ result: "passed",data: data  }))
            }
        })
    })

    router.post("/addToBookings",(req,res)=> {
        var data = req.body
        var sql = `insert into current_bookings_on_hold (gymId, userDetails,bookedSlot) values
                    (${data.gymId}, ${JSON.stringify(data.userDetails)}, '${data.bookedSlot}');`

        conn.query(sql,function(err,data,fields){
            if (err) {
                console.log(err)
                res.send(JSON.stringify({ result: "failed" }))
            } else {
                console.log("Slot booked")
                res.send(JSON.stringify({ result: "passed",data: data}))
            }
        })
    })

    








module.exports = router;