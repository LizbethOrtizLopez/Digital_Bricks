const mysql = require("mysql");
const jws = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

//app.use(bodyParser.json());      
app.use(express.static(__dirname + '/views'));


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

var sess;


exports.register = (req, res) => {
    
    var reqPath = path.join(__dirname, '../');
    const { nombres, apellidos, correo, password, edad, passwordConfirm, username } = req.body;
    db.query('SELECT correo FROM Usuario WHERE correo = ?', [correo], async (error, results) => {
        if (error) {
            console.log(error);
        }
        console.log("Actual password: "+password);

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log("Hashed password"+hashedPassword);

        if (results.length > 0) {
            res.render('register', {error:'El email ya está en uso'});
        } else if (password !== passwordConfirm) {
            res.render('register', {error:'No hay coincidencia en las contraseñas'});

        } else {
            db.query('SELECT nombreUsuario FROM Usuario WHERE nombreUsuario = ?', [username], (error, results) => {
                if (error) {
                    res.render('register', {error:'ERROR'});
                }
                if (results.length > 0) {
                    res.render('register', {error:'El nombre de usuario ya está en ocupado'});
                }else{
                    db.query('INSERT INTO Usuario SET ?', { nombre: nombres, apellido: apellidos, correo: correo, contrasena: hashedPassword, nombreUsuario: username,edad: edad,cursosCompletos: '0', cursosPendientes: '0' }, (error, results) => {
                        if (error) {
                            res.render('register', {error:'ERROR'});
                        } else {
                            console.log(hashedPassword)
                            res.render('login', {error:'User registered'});
                        }
                    });
                }
            });
        }


        

    });



}
exports.login = (req, res) => {
    const {userId} = req.session
    const {nombreUsuario} = req.session
    const {apellido} = req.session
    const {nombre} = req.session
    const {correoEle} = req.session
    const {edad} = req.session
    const {cursosCompletos} = req.session
    console.log("login auth ")
    console.log(req.session)
    var reqPath = path.join(__dirname, '../');
    const { correo, password } = req.body;
    console.log(req.body);

    db.query('SELECT idUsuario, nombre, apellido, correo, contrasena, nombreUsuario, edad, cursosCompletos FROM Usuario WHERE correo = ?', [correo], async (error, results) => {
        if (error) {
            res.render('login', {error:'ERROR'});
        }
        if (results.length == 0) {

            res.render('login', {error:'Credenciales inválidas'});
        } else {
            bcrypt.compare(password, results[0].contrasena, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    throw err
                } else if (!isMatch) {
                    res.render('login', {error:"Contraseña inválida"});
                } else {
                    req.session.userId = results[0].idUsuario
                    req.session.nombreUsuario = results[0].nombreUsuario
                    req.session.apellido = results[0].apellido
                    req.session.nombre = results[0].nombre
                    req.session.correoEle = results[0].correo
                    req.session.edad = results[0].edad
                    req.session.cursosCompletos = results[0].cursosCompletos
                    
                    console.log(req.session)
                    res.render('perfil', {msj :req.session});

                }
            })
        }
    });
}

exports.logout = (req, res) => {
    req.session.destroy(err=>{
        if(err){
            return res.sendFile('login.html', { root: path.join(reqPath, "views/") });
        }
        res.clearCooke(req.session.SESS_NAME)
        res.sendFile('login.html', { root: path.join(reqPath, "views/") });
    })

}
