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

router.post("/deleteCurrentBookings",(req,res)=> {
    var dat = req.body
    var sql = `start transaction;
               select * from gymSLOTS  where gymId=${dat.gymId} for update;
               update current_bookings_on_hold set status='D' where id=${dat.id};
               update gymSLOTS set ${dat.slot} = ${dat.slot}+1  where gymId=${dat.gymId} and ${dat.slot}<=${dat.capacity};
               commit;
               `
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



router.post("/updateConfirmedUsers",(req,res)=> {
    var dat = req.body
    console.log(dat)
    var sql =`start transaction;
              update confirmedUsers set users='${JSON.stringify(dat.users)}' where gymId=${dat.gymId};
              update current_bookings_on_hold set status='C' where id=${dat.id};
              commit;`
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

router.post("/updateConfirmedSlotUsers",(req,res)=> {
    var dat = req.body
    console.log(dat)
    var sql =`start transaction;
              update confirmedUsers set users='${JSON.stringify(dat.users)}' where gymId=${dat.gymId};
              update current_bookings_on_hold set status='${dat.status}' where id=${dat.id};
              commit;`
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



router.post("/getConfirmedUsers",(req,res)=> {
    var dat = req.body
    var sql = `select * from confirmedUsers where gymId=${dat.gymId};`
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            res.send(JSON.stringify({ result: "passed", data: data}))
        }
    })

})

router.post("/getSlots",(req,res)=> {
     var dat = req.body
     var sql = `select * from slotManagement where gymId=${dat.gymId};`
     conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            res.send(JSON.stringify({ result: "passed", data: data[0]}))
        }
    })
})

router.post("/updateSlots",(req,res)=>{
    var dat = req.body
    var sql = `insert into slotManagement (gymId,slots) values (${dat.gymId},'${JSON.stringify(dat.slots)}');`
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