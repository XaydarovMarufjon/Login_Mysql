const mysql = require("mysql")
const bcrypt = require("bcryptjs");
const async = require("hbs/lib/async");
const db = mysql.createConnection({
  host : process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password :process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE
})

exports.register = (req , res )=>{
   const {name , email , password , passwordConfirm } = req.body ;
   db.query("SELECT email FROM users WHERE email =?" [email], async (error ,results)=>{
     if (error) {
        console.log(error);
     }
     if(results.length > 0 ){
        return res.render("register" , { 
        message :  " that email is alredy token "
       });
     } else if(password != passwordConfirm){
        return res.render("register" , { 
        message :  " password do no match"
       });
     }

     let hashedPassword = await bcrypt.hash(password , 8);
     console.log(hashedPassword);
   });
};