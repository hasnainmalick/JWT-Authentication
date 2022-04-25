// This is file created due to route if we define all route in index.js the file become messy.
const router = require("express").Router();
const { check, validationResult } = require('express-validator')
const { users } = require('../db')


const bcrypt = require('bcrypt')
// import jsonwebtoken
const JWT = require('jsonwebtoken');
const { json } = require("express/lib/response");

router.get('/', (req, res) => {
    res.send('I am auth')
})
router.post('/signup', [
    check("email", "Please input correct email")
        .isEmail(),
    check("password", "Enter correct password")
        .isLength({
            min: 6
        })
], async (req, res) => {
    const { password, email } = req.body;
    // console.log(password, email)
    // validate the inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    // If user exist
    // Validate if the user doesnt already exist;
    let user = users.find((user) => {
        return user.email === email;

    })

    if (user) {
        return res.status(422).json({
            errors: [{
                msg: "This user already exists",
            }]
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // to pushing hash data into database;
    users.push({
        email,
        password: hashedPassword
    })
    // console.log(hashedPassword)
    // using json web tokens
    const token = await JWT.sign({
        email,
    }, 'nfb32iur32ibfqfvi3vf932bg932g932', {
        expiresIn: 3600000
    })

    res.json({
        token
    })
    // res.send("Validated")
})
// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    // Check if user with email exists

    let user = users.find((user) => {
        return user.email === email
    });

    if (!user) {
        return res.status(422).json({
            errors: [
                {
                    msg: "Invalid Credentials from login user",
                }
            ]
        })
    }

    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(404).json({
            errors: [
                {
                    msg: "Invalid Credentials from login"
                }
            ]
        })
    }
    // Send JSON WEB TOKEN
    const token = await JWT.sign({
        email,
    }, 'nfb32iur32ibfqfvi3vf932bg932g932', { expiresIn: 3600000 })

    res.json({
        token
    })

})
// to get all user
router.get('/users', (req, res) => {
    res.json(users)
})

module.exports = router