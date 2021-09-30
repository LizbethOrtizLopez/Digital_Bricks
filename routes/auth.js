const express = require('express');
const path = require('path');
const authController = require('../controllers/auth');
const router = express.Router();
var reqPath = path.join(__dirname, '../');


const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.send('login', { root: path.join(reqPath, "views/") });
    }else{
        next()
    }
};

const redirectHome = (req, res, next) => {
    if(!req.session.userId){
        res.send('perfil', { root: path.join(reqPath, "views/") });
    }else{
        next()
    }
};


router.use(express.static(reqPath+"/views"));

router.post("/register", authController.register)

router.post("/login", authController.login)

router.post("/logout",authController.logout)



module.exports = router;