let express = require('express'),
    router = express.Router(),
    async = require('async'),
    conn = require('../../mysql_config/cred');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { 
        "encryptedData": encrypted.toString('hex'),
        "iv" : iv.toString('hex'),
        "key" : key.toString('hex')
    //returns an Array of key, iv & encryptedData
    }
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex')//will return iv;
    let enKey = Buffer.from(text.key, 'hex')//will return key;
    let encryptedText = Buffer.from(text.encryptedData, 'hex');//returns encrypted Data
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(enKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
    //returns decryptedData
}


router.post("/",(req,res)=>{
    var dat = req.body
    //console.log(dat)
    var sql = `select gymId, password from gymOwnerLogin where gymId= ${dat.gymId};`
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            //console.log("Slot booked")
            var storedPassword = JSON.parse(data[0].password)
            //console.log(storedPassword)
            if (dat.password === decrypt(storedPassword)){
                res.send(JSON.stringify({ result: "passed"}))
            }else {
                res.send(JSON.stringify({ result: "failed" }))
            }
          
            
        }
    })
})

router.post("/enrollCustomer",(req,res)=>{
    var data= req.body
    var hw=encrypt(data.password)
    var sql = `insert into gymOwnerLogin (gymId,password) values (${data.gymId},'${JSON.stringify(hw)}');`
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            res.send(JSON.stringify({ result: "failed" }))
        } else {
            console.log("Slot booked")
            res.send(JSON.stringify({ result: "passed"}))
        }
    })

})


module.exports = router;