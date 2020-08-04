let express = require('express'),
    router = express.Router();
    conn = require('../../mysql_config/cred');

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