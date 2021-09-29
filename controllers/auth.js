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

        if (results.length > 0) {
            console.log('El email ya está en uso');
            return res.sendFile('register.html', { root: path.join(reqPath, "views/") });

        } else if (password !== passwordConfirm) {
            console.log('No hay coincidencia en las contraseñas');

            return res.sendFile('register.html', { root: path.join(reqPath, "views/") });

        } else {
            db.query('SELECT nombreUsuario FROM Usuario WHERE nombreUsuario = ?', [username], (error, results) => {
                if (error) {
                    console.log(error);
                }
                if (results.length > 0) {
                    console.log('El nombre de usuario ya está en ocupado');
                    return res.sendFile('register.html', {
                        root: path.join(reqPath, "views/")
                    });
                }
            });
        }
        console.log("Actual password: "+password);

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log("Hashed password"+hashedPassword);

        db.query('INSERT INTO Usuario SET ?', { nombre: nombres, apellido: apellidos, correo: correo, contrasena: hashedPassword, nombreUsuario: username,edad: edad,cursosCompletos: '0', cursosPendientes: '0' }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(hashedPassword)

                
                return res.sendFile('login.html', {
                    root: path.join(reqPath, "views/"), message: 'User registered'
                });
            }
        });

    });



}
exports.login = (req, res) => {
    const {userId} = req.session
    console.log("login auth ")
    console.log(req.session)
    var reqPath = path.join(__dirname, '../');
    const { correo, password } = req.body;
    console.log(req.body);

    db.query('SELECT idUsuario, contrasena FROM Usuario WHERE correo = ?', [correo], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length == 0) {
            console.log('Credenciales inválidas');
            return res.sendFile('login.html', { root: path.join(reqPath, "views/") });
        } else {
            bcrypt.compare(password, results[0].contrasena, (err, isMatch) => {
                if (err) {
                    console.log(err);
                    throw err
                } else if (!isMatch) {
                    console.log("Password doesn't match!")
                    return res.sendFile('login.html', { root: path.join(reqPath, "views/") });
                } else {
                    console.log("Password matches!")
                    req.session.userId = results[0].idUsuario
                    console.log(req.session)
                    return res.sendFile('perfil.html', { root: path.join(reqPath, "views/") });

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