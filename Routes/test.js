let express = require('express'),
    router = express.Router();
    conn = require('../mysql_config/cred');


router.get('/',(req,res)=> {
    res.send("testing")
})


router.post("/updateGyms",(req,res)=> {
    var data = req.body
    var location =  JSON.stringify(data.location)
    var contactInfo =  JSON.stringify(data.contactInfo)
    var photos =  JSON.stringify(data.photos)
    var price =  JSON.stringify(data.price)
    var slots =  JSON.stringify(data.slots)
    var additionalInfo =  JSON.stringify(data.additionalInfo)
    //console.log(data.gymId)
    

    var sql = `insert into gymList (gymname,location,contactInfo,gymId,price,photos,slots,additionalInfo) 
                values ('${data.gymname}','${location}','${contactInfo}',${parseInt(data.gymId)},'${price}','${photos}','${slots}','${additionalInfo}');`

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

router.post("/updateSLOTS",(req,res)=>{

    var data = req.body
    var slots =  req.body.slots

    var appendString1 = ""
    var appendString2 = ""

    for(var i=0;i<slots.length-1;i++){
        var name = slots[i].name
        var capacity = slots[i].capacity
        appendString1+=`${name},`
        appendString2+= `${capacity},`

    }

    appendString1+=`${slots[slots.length-1].name}`
    appendString2+=`${slots[slots.length-1].capacity}`


    var sql =`insert into gymSLOTS (gymID,` + appendString1 + ')' + `values ( ${data.gymId},` + appendString2+');'
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("true 1")
            res.send(JSON.stringify({ result: "passed" }))
        }
    })
   

})

router.get("/getList",(req,res)=>{
    var sql = "select * from gymList;"
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

router.get("/getSLOTS",(req,res)=> {
    var sql = "select * from gymSLOTS;"
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

module.exports = router;