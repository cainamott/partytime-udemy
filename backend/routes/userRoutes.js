const express = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

const verifyToken = require("../helpers/check-token");

const getUserByToken = require("../helpers/get-user-by-token");

router.get("/:id", async(req, verifyToken ,res) => {

    const id = req.params.id;

    try{
        const user = await User.findOne({_id: id}, {password : 0});

        res.json({error: null, user});

    }catch(error){
        return res.status(400).json({error:"Usuário inexistente"});
    }

});

router.patch("/", async (req, verifyToken, res) => {
    const token = req.header("auth-token");
    const user = await getUserByToken(token);
    const userReqId = req.body.id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const userId = user._id.toString();

    if(userId != userReqId){
        res.status(401).json({error: "Acesso Negado"})
    }

});

module.exports = userRouter;