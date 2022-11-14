const express = require('express');
const router = express.Router();
var database = require('../db/mysqlConnection');
var bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

var urlencodedParser = bodyParser.urlencoded({ extended: true })
var jsonParser = bodyParser.json()


router.get("/", function(request, response, next){
	response.send('List all Data');
});

router.post("/log_in",  
    body('email').isEmail(), 
    body('password').isLength({min:8}), 
    jsonParser, async function(request, response, next){
	
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log('erros:', errors);
    }else{
        console.log('Got body:', request.body);

        var email = request.body.email;
        var password = request.body.password;

        var query = `SELECT password FROM usuarios where correo = "${email}"`;

        database.query(query, function(error, hash){
            if(error){
                throw error;
            }else{
                bcrypt.compare(password, hash[0].password, function(err, result) {
                    if (result) {
                        const loc = document.location;
                        console.log('Contraseña correcta');
                        loc.pathname = "index";
                   }else{
                        console.log('Contraseña incorrecta');
                   }
                })
                console.log(response.sendStatus(200)) 
            }
    	});
    }
});

module.exports = router;