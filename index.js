import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const URL = "https://v2.jokeapi.dev/joke/";

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static("public"));


app.get("/",(req,res) => {
    res.render("index.ejs",{});
});

app.get("/joke-api",async (req,res) => {
    res.render("jokeapi.ejs",{
        joke:[],
    }); 
});


app.post("/get-a-joke", async (req,res) => {
    let tempURL = URL;

    // add  category to URL
    if (req.body["any-category"] === 'yes'){
        tempURL += 'Any';
    }
    else {
        if (typeof req.body.category === "string") {
            tempURL += req.body.category;
        }
        else{
            for (let cat of req.body.category) {
                tempURL += cat;
                tempURL += ',';
                
            };
            if (tempURL.endsWith(",")) {
                tempURL = tempURL.slice(0, -1);
            };
        };
        
    };



    //add language
    if (req.body.lang !=='en'){
        tempURL += '?lang=';
        tempURL += req.body.lang
    }
    else{
        tempURL += '?';
    };

    //Black List
    if (!req.body.blacklist || (Array.isArray(req.body.blacklist) && req.body.blacklist.length === 0) || req.body.blacklist === "") {

        tempURL += '';
    } else if (typeof req.body.blacklist === "string") {
        if (tempURL.endsWith("?")) {
            tempURL += 'blacklistFlags=';
        }
        else{
            tempURL += '&blacklistFlags=';
        };
        
        tempURL += req.body.blacklist;
    } else {
        if (tempURL.endsWith("?")) {
            tempURL += 'blacklistFlags=';
        }
        else{
            tempURL += '&blacklistFlags=';
        };
        for (let black of req.body.blacklist) {
            tempURL += black;
            tempURL += ',';
        }
        if (tempURL.endsWith(",")) {
            tempURL = tempURL.slice(0, -1);
        }
    }
    

    // Joke type
    if (req.body['joke type'] ==='single' ){
        if (tempURL.endsWith("?")) {
            tempURL += 'type=single';
        }
        else{
            tempURL += '&type=single';
        };
        
    }
    else if (req.body['joke type'] ==='twopart' ){
        if (tempURL.endsWith("?")) {
            tempURL += 'type=twopart';
        }
        else{
            tempURL += '&type=twopart';
        };
    }

    //joke-count
    if(req.body['joke-count'] !=='1' ){
        tempURL += '&amount=';
        tempURL += req.body['joke-count'];
    };


    const result = await axios.get(tempURL);
    let jokeList =JSON.stringify(result.data)
    let JOKE = [];
    
    //check for joke count
    if ("amount" in JSON.parse(jokeList)){
        let jokes = JSON.parse(jokeList)["jokes"];

        for (let joke of jokes){
            //handling single jokes
            if ("joke" in joke){
                JOKE.push(joke["joke"]);

            }
            //handling two parts jokes
            else{

                let j = joke["setup"] + "<br>" + joke["delivery"];
                JOKE.push(j);
            };
        };

    }
    else{
        //handling single jokes

        if ("joke" in JSON.parse(jokeList)){
            JOKE.push(JSON.parse(jokeList)["joke"]);

        }
        //handling two parts jokes
        else{

            let j = JSON.parse(jokeList)["setup"] + "<br>" + JSON.parse(jokeList)["delivery"];
            JOKE.push(j);
        };
    };
    res.render("jokeapi.ejs",{
        joke:JOKE
    });
});










app.listen(PORT, () => {
    console.log(`Server Running on port : ${PORT}`);
});