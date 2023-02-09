const mysql = require("mysql")
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host : process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password :process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE
})

// SIGN UP
exports.register = (req, res) => {
  console.log(req.body);
  const {name, email, password, passwordConfirm} = req.body;
  db.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) => {
    if(error) {
      console.log(error);
    }
    if(!email) {
      return res.render('register', {
        message: ` Iltimos, elektron pochtani kiriting` ,
        active : "alert-warning" ,
      });
    }
    if(!password) {
      return res.render('register', {
        message: ` Iltimos parolni kiriting` ,
        active : "alert-warning", 
      });
    }
    if(!name) {
      return res.render('register', {
        message: ` Iltimos ismni kiriting` ,
        active : "alert-warning",
      });
    }
    if(results.length > 0) {
      return res.render('register', {
        message: ` " ${email} " allaqachon ro\'yhatdan o\'tgan ` ,
        active : "alert-danger",
      });
    }else if(password !== passwordConfirm){
      return res.render('register', {
        message: 'Passwordlar mos kelmadi' ,
        active : "alert-danger",
        border : "border border-danger"

      });
    }
    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    // insert bazaga jonatamiz
    db.query("INSERT INTO users SET ?" , {name: name , email: email, password: hashedPassword}, (error , results)=>{
      if (error) {
        console.log(error);
      } else{
        console.log(results);
        return res.render('register' , {
          message : "Siz registratsyadan otdingiz",
          active : "alert-success"
        })
      }
    })

   });
};

// LOG IN

exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password) {
      return res.status(400).render('login', {
        message: 'Iltimos, elektron pochta va parolni kiriting' ,
        active : "alert-warning"
      });
    }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      console.log(results);
      if(!results || !(await bcrypt.compare(password, results[0].password))){
        res.status(401).render('login', {
          message: 'Elektron pochta yoki parol xato' , 
          border : "border border-danger"
        });
      }else{
        const id = results[0].id;
        res.status(200).redirect('/');
      }
    });
  } catch (error) {
    console.log(error);
  }
};