const router = require('express').Router();

const Users = require('./user-model')

router.get('/', (req, res)=> {
    Users.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({errorMessage: `${err}`})
    })
})

module.exports = router;