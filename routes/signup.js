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

router.post("/sign_up_user", 
    body('name').notEmpty(), 
    body('email').isEmail(), 
    body('password').isLength({min:8}), 
    jsonParser, async function(request, response, next){
	
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log('erros:', errors);
    }else{
        console.log('Got body:', request.body);

        var name = request.body.name;
        var email = request.body.email;
        var password = request.body.password;

        const encryptedPassword = await bcrypt.hash(password, saltRounds)

        var query = `
        INSERT INTO usuarios 
        (nombre, correo, password) 
        VALUES ("${name}", "${email}", "${encryptedPassword}")
        `;

        database.query(query, function(error, data){
            if(error){
                throw error;
            }else{
                console.log(response.sendStatus(200)) 
            }
    	});
    }
});

module.exports = router;