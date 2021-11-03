const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");


const jwtSecret = "asfdwçobnlllllahyuhnbflakjshflksadsadasa";

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function auth(req, res, next){
    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var tokem = bearer[1];
    

        jwt.verify(tokem, jwtSecret, (err, data) => {
            if(err){
                res.status(401);
                res.json({err: "Token invalidoo"});
            }else{
                req.tokem = tokem;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        })

    }else{
        res.status(401);
        res.json({err: "Token invalido"});
    }

    console.log(authToken);
    
}


var DB = {
    games: [
        {
            id: 01,
            title: "CAll of Dutty",
            year: 2008,
            price: 60
        },
        {
            id: 02,
            title: "Minecraft",
            year: 2018,
            price: 80
        },
        {
            id: 03,
            title: "Pes 2020",
            year: 2020,
            price: 40
        }
    ],
    users: [
        {
            id: 1,
            nome: "ROOT",
            email: "gabriel@gmail.com",
            senha: "gabriel"
        }
    ]
}

app.get("/games",auth,  (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/games/:id", (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
        }

    }

})

app.post("/game", (req, res) => {
    var {title, price, year} = req.body;

    DB.games.push({
        id: 654,
        title,
        price, 
        year
    });

    res.sendStatus(200);

})

app.delete("/game/:id", (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index, 1);
            res.sendStatus(200);
        }
       
    }
})

app.put("/game/:id", (req, res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt( req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            var {title, price, year} = req.body;

            if(title != undefined){
                game.title = title;
            }

            if(price != undefined){
                game.price = price;
            }

            if(year != undefined){
                game.year = year;
            }

            res.sendStatus(200)

        }else{
            res.sendStatus(404);
        }
    }
    
})

app.post("/auth", (req, res) => {
    var {email, senha} = req.body;

    if(email != undefined){

        var user = DB.users.find(u => u.email == email);

        if(user != undefined){
            if (user.senha == senha){

                jwt.sign({id: user.id, email: user.email}, jwtSecret, {expiresIn: '48h'}, (err, token) => {
                    if(err){
                        res.status(400);
                        res.json({err: "Falha interna"})
                    }else{
                        res.status(200);
                        res.json({token: token});
                    }
                });

            }else{
                res.status(401);
                res.json({err: "Credenciais invalidas"});
            }
        }else{
            res.status(404);
            res.json({err: "O email nn existe no banco de dados"})
        }

    }else{
        res.status(400);
        res.json({err: "O email é invalido"});
    }
})

app.listen(3030, () => {
    console.log("Rodando....")
})