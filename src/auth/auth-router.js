const express = require("express");
const AuthService = require("./auth-service");

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter 
    .route('/token')
    .post(jsonBodyParser, async (req, res, next) => {
        const { username, password } = req.body 
        const loginUser = { username, password }

        for (const [key, value] of Object.entries(loginUser))
            if(value == null)
                return res.status(400).json({
                    error: `Missing '${key} in request body`
                })
    })

    