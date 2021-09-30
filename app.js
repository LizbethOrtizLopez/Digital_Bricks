const express = require("express");
const session = require("express-session")
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({path:'./.env'});

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    NODE_ENV = 'development',
    SESS_LIFE = TWO_HOURS,
    SESS_NAME ='sid',
    SESS_SECRET ='ssh!\'secret'

} = process.env

const IN_PROD = NODE_ENV === 'production'
/*

const users =[
    {id: 1, nombre: "a", apellido: "p", correo: "correo@h.com", contrasena: "hashedPassword", nombreUsuario: "car",edad: "12" ,cursosCompletos: '0', cursosPendientes: '0' },
    {id: 2, nombre: "a", apellido: "p", correo: "correo@ha.com", contrasena: "hashedPassword", nombreUsuario: "carl",edad: "12" ,cursosCompletos: '0', cursosPendientes: '0' }

]*/


const app = express();
app.set('view engine', 'ejs')

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge:SESS_LIFE,
        sameSite: true,
        secure:IN_PROD
    }
}))



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
    });


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(__dirname+"/views"));


db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("MYSQL Connected...")
    }
})
const path = require('path');


/*Routes*/
app.use('/', require('./routes/pages'))
app.use('/auth', require('./routes/auth'))


app.listen(8000, ()=>{
    console.log("server started on Port 5000")
})