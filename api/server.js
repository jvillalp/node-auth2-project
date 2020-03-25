//npm i
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')

//take them from their js files
const usersRouter = require('../users/users-router')
const authRouter = require('../auth/auth-router')
const restricted = require('../auth/restricted-middleware')
const server = express()

//sessionConfig
const sessionConfig = {
    name:'monster',
    secret:"let's keep this a secret",
    cookies: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

//use them
server.use(helmet())
server.use(express.json())
server.use(morgan('dev'))
server.use(cors())
server.use(session(sessionConfig))

server.use('/api/users', restricted, checkRole('hr'), usersRouter)
server.use('/api/auth',authRouter)

server.get('/', (req,res) => {
    res.status(200).json({ message: `This is working!`})
})

module.exports = server

function checkRole(role){
    return (req, res, next)=> {
        if(
            req.decodedToken &&
            req.decodedToken.department &&
            req.decodedToken.department.toLowerCase() === role
        ){
            next()
        }else {
            res.status(403).json({ you: 'shall not pass!'})
        }
    }
}