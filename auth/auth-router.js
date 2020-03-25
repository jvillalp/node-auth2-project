const bcrypt = require("bcryptjs");
const router = require("express").Router();
const Users = require("../users/user-model");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

router.post("/register", (req, res) => {
  const UserInfo = req.body;
  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(UserInfo.password, ROUNDS);

  UserInfo.password = hash;

  Users.add(UserInfo)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        req.session.user = {
          id: user.id,
          username: user.username
        },
          res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(400).json({ errorMessage: `${err}` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` });
    });
});

router.get('/logout', (req,res) => {
    if(req.session){
        req.session.destroy(err => {
        if(err){
            res 
               .status(500)
               .json({
                   message: `you can checkout anytime you want`
               })
        }else{
            res.status(200).json({ message: `you are logged out`})
        }
    })
    }else {
        res.status(200).json({message: `already logged out`})
    }
})

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department:user.department || 'lab'
  };
  const options = {
    expiresIn: '1hr'
  }
  return jwt.sign(payload,jwtSecret, options)
}

module.exports = router;
