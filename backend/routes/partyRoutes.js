const router = require("express").Router();
const bcrypt = require("bcrypt");
const multer = require("multer");

const verifyToken = require("../helpers/check-token");
const getUserByToken = require("../helpers/get-user-by-token");

const User = require("../models/user");
const Party = require("../models/party");

const diskStorage = require("../helpers/file-storage");
const { route } = require("./authRoutes");
const upload = multer({storage: diskStorage});

router.post("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const partyDate = req.body.partyDate;

    let files = [];

    if(req.files){
        files = req.files.photos
    }

    if(title == "null" || description == "null" || partyDate == "null"){
        return res.status(400).json({error: "Preencha ao menos, titulo, descrição e data"});
    }

    const token = req.header("auth-token");
    const userByToken = await getUserByToken(token);
    const userId = userByToken.userId.toString();

    try{
        const user = await User.findOne({_id: userId}); 

        let photos = [];

        if(files && files.length > 0){

            files.forEach((photo, i) => {
                photos[i] = photos.path
            });
        }

        const party = new Party({
            title: title,
            description: description,
            partyDate: partyDate,
            photos: photos,
            privacy: req.body.privacy,
            userId: userId
        })

        try{
            const newParty = await party.save();
            res.json({error: null, msg: "Evento criado com sucesso", data: newParty});
        }catch(error){
            return res.status(400).json({error: "Acesso negado"});
        }

    }catch(err){
        return res.status(400).json({error: "Acesso negado"});
    }    
});

router.get("/all", async (req, res) => {
    try{

        const parties = (await Party.find({privacy: false})).sort([['_id', -1]]);
        res.json({error: null, parties: parties});

    }catch(error){

        return res.status(400).json({error});
    }
});

router.get("/userparties", verifyToken, async(req, res) => {

    try{

        const token = req.header("auth-token");
        const user = await getUserByToken(token);
        const userId = user._id.toString();
        
        const parties = await Party.find({userId: userId});
        res.json({error: null, parties: parties});

    }catch(error){
        return res.status(400).json({error});
    }

});

router.get("/userparty/:id", verifyToken, async (req,res) => {
    try{

        const token = req.header("auth-token");
        const user = await getUserByToken(token);
        const userId = user._id.toString();
        
        const partyId = req.params.id;
        const party = await Party.findOne({_id: partyId, userId: userId});

        res.json({error: null, party: party});

    }catch(error){
        return res.status(400).json({error});
    }
});


router.get("/:id", async (req, res) => {

    try{
        const partyId = req.params.id;

        const party = await Party.findOne({_id: partyId});

        if(party.privacy == false){
             res.json({error: null, party: party});
        }else{
            const token = req.header("auth-token")
            const user = await getUserByToken(token);

            const userId = user._id.toString();
            
            const userPartyId = party.userId.toString();

            if(userId == userPartyId){
                res.json({error: null, party: party});
            }
        }

    }catch(error){
        return res.status(400).json({error: "Evento não existe"});
    }
});

router.delete("/", verifyToken, async (req, res) => {

    const token = req.header("auth-token")
    const user = await getUserByToken(token);
    const partyId = req.body.id;
    const userId = user._id.toString();

    try{
        await Party.deleteOne({_id: partyId, userId: userId});
        res.json({error: null, msg: "Evento Removido"});
    }catch(error){
        return res.status(400).json({error: "Acesso Ngeado"});
    }

});

router.put("/", verifyToken, upload.fields([{name: "photos"}]), async (req, res) => {

    const title = req.body.title;
    const desciption = req.body.description;
    const partyDate = req.body.partyDate;
    const partyId = req.body.partyId;
    const partyUserId = req.body.user_id;

    let files = [];

    if(req.files){
        files = req.files.photos
    }

    if(title == "null" || description == "null" || partyDate == "null"){
        return res.status(400).json({error: "Preencha ao menos, titulo, descrição e data"});
    }

    const token = req.header("auth-token")
    const user = await getUserByToken(token);
    const userId = user._id.toString();
})

module.exports = router;