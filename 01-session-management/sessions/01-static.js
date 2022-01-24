const express = require('express')
const session = require('express-session')

const app = express()
const port = 3000

var session_options = {
    secret: "some_randomly_generated_string_here!",
    cookie: {
        secure: "auto",
        maxAge: 10000
    },
    resave: false,
    saveUninitialized: false,
    rolling: false,
}

app.use(session(session_options))

app.get('/', (req, res) => {
    if (!req.session.initialized) {
        req.session.initialized = 0
        res.write('New session_id created!\n')
    }

    // if you don't do this, client-side cookies will expire too soon!
    // basically, you need any change to req.session to refresh cookies client-side.
    req.session.initialized++

    res.write('session_id: ' + req.session.id + '\n')
    res.write('expires in: ' + (req.session.cookie.maxAge / 1000) + 's\n')
    res.write('expires at: ' + (req.session.cookie.expires) + '\n')

    res.end()
})

app.listen(port, () => {
    console.log(`Static Sessions app listening at http://localhost:${port}`)
})
