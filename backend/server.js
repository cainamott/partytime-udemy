//modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//routes
const authRouter = require("./routes/authRoutes")

//config
const dbName = "partytimeb";
const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);

mongoose.connect(
    `mongodb://localhost/${dbName}`
);

app.get("/", (req, res) => {

    res.json({message: "Rota teste"})
    
});

app.listen(port, () =>{

    console.log(`O backend esta rodando na porta ${port}`);
})