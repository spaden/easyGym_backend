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
    
    console.log(photos)

    var sql = `insert into gymList (gymname,location,contactInfo,gymId,price,photos,slots,additionalInfo) 
                values ('${data.gymname}','${location}','${contactInfo}','${data.gymId}','${price}','${photos}','${slots}','${additionalInfo}');`

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

module.exports = router;