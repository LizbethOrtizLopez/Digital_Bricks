const express = require('express');
//const session = require('express-session');
//const bodyParser = require('body-parser');

const path = require('path');
//const app = express();

const router = express.Router();
var reqPath = path.join(__dirname, '../');



router.use(express.static(reqPath+"/views"));



const redirectLogin = (req, res, next) => {
    console.log(req.session.userId)
    if(!req.session.userId){
        res.sendFile('login.html', { root: path.join(reqPath, "views/") });
    }else{
        next()
    }
};

const redirectHome = (req, res, next) => {
    console.log(req.session.userId)

    if(!req.session.userId){
        res.sendFile('perfil.html', { root: path.join(reqPath, "views/") });
    }else{
        next()
    }
};

router.get("/", /*redirectHome,*/(req, res) => {
    console.log("home pages")
    const {userId} =req.session
    if(userId){
        console.log(userId)

    }
    res.sendFile('index.html',{root:path.join(reqPath,"views/")});
})

router.get("/register",/* redirectHome,*/ (req, res) => {
    console.log("Register pages ")
    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.render('register');
})

router.get("/login", /*redirectHome,*/ (req, res) => {
    console.log("Login pages ")
    
    const {userId} =req.session
    if(userId){
        console.log(userId)

    }

    res.render('login');
})
router.get("/perfil", /*redirectLogin,*/ (req, res) => {
    console.log("Perfil pages ")
    console.log(req.session)

    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.render('perfil',{msj :req.session});

})

router.get("/1", /*redirectLogin,*/ (req, res) => {
    console.log("1 pages ")
    console.log(req.session)

    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.sendFile('1.html',{root:path.join(reqPath,"views/")});
})
router.get("/2", /*redirectLogin,*/ (req, res) => {
    console.log("2 pages ")
    console.log(req.session)

    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.sendFile('2.html',{root:path.join(reqPath,"views/")});
})

router.get("/cursos", /*redirectLogin,*/ (req, res) => {
    console.log("Cursos pages ")
    console.log(req.session)

    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.sendFile('cursos.html',{root:path.join(reqPath,"views/")});
})
router.get("/progra", /*redirectLogin,*/ (req, res) => {
    console.log("Progra pages ")
    console.log(req.session)

    const {userId} =req.session
    if(userId){
        console.log(userId)
    }
    res.sendFile('progra.html',{root:path.join(reqPath,"views/")});
})
module.exports = router;