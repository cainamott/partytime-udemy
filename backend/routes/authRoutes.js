const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("..models/user");

//register user

router.post("/register", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(name == null || email == null || password == null || confirmPassword == null){
        return res.status(400).json({error: "Por favor preencha todos os campos"});
    }
    if(passoword != confirmPassword){
        return res.status(400).json({error: "As senhas não conferem"})
    }
});

module.exports = router;