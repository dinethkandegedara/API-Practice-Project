import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;

app.set("view engine","ejs");
app.use(express.static("public"));


app.get("/",(req,res) => {
    res.render("index.ejs",{});
});

app.get("/joke-api",(req,res) => {
    try{
        const result = axios.get("https://v2.jokeapi.dev/joke/Any");
        console.log(result);
    }
    catch(error){
        console.log(error.response.data);
        res.status(500);
    }
});














app.listen(PORT, () => {
    console.log(`Server Running on port : ${PORT}`);
});