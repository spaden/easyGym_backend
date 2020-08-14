let express = require('express'),
    router = express.Router(),
    async = require('async'),
    conn = require('../../mysql_config/cred'),
    multer = require("multer"),
    fs = require('fs'),
    mv = require('mv');

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


function insertSLots(gymId,appendString1,appendString2){
    var sql =`insert into gymSLOTS (gymID,` + appendString1 + ')' + `values ( ${gymId},` + appendString2+');'
    conn.query(sql,function(err,data,fields){
        if (err) {
            console.log(err)
            
        } else {
            console.log("true 1")
            
        }
    })
}

let upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './Assets/temp')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })
});

router.post("/gymImages",upload.array('myFiles', 12), (req, res, next) => {
    
    const files = req.files

    console.log(req.body.gymId)
    if (!files) {
    const error = new Error('Please choose files')
    error.httpStatusCode = 400
    return next(error)
   }
   fs.mkdirSync(`./Assets/${req.body.gymId}/`);
   var arr=[]
   for(var i=0;i<files.length;i++){
       var fl = files[i].filename
       console.log(fl)
       arr.push(fl)
        mv('./Assets/temp/'+fl, `./Assets/${req.body.gymId}/`+fl, function (err) {
            if (err) {
                return console.error(err);
            }   
        });

   }
    console.log(fl)
    res.send(JSON.stringify(fl))
});


router.post("/gymDetails",(req,res)=>{

     var data = req.body
     var location =  JSON.stringify(data.location)
     var contactInfo =  JSON.stringify(data.contactInfo)
     var photos =  JSON.stringify(data.photos)
     var price =  JSON.stringify(data.price)
     var slots1 =  JSON.stringify(data.slots1)
     var additionalInfo =  JSON.stringify(data.additionalInfo)

     var slots2 =  data.slots2

    var appendString1 = ""
    var appendString2 = ""

    for(var i=0;i<slots2.length-1;i++){
        var name = slots2[i].name
        var capacity = slots2[i].capacity
        appendString1+=`${name},`
        appendString2+= `${capacity},`

    }

    appendString1+=`${slots2[slots2.length-1].name}`
    appendString2+=`${slots2[slots2.length-1].capacity}`
    insertSLots(data.gymId,appendString1,appendString2)

    var hw=encrypt(data.password)

    var sql =`start transaction;
     
     insert into gymList (gymname,location,contactInfo,gymId,price,photos,slots,additionalInfo) 
     values ('${data.gymname}','${location}','${contactInfo}',${parseInt(data.gymId)},'${price}','${photos}','${slots1}','${additionalInfo}');
     
     insert into gymOwnerLogin (gymId,password) values (${data.gymId},'${JSON.stringify(hw)}');
     
     insert into confirmedusers (gymId) values (${data.gymId});

     insert into slotManagement (gymId,slots) values (${data.gymId},'${JSON.stringify(data.slots3)}');

     commit;
     `

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





module.exports = router