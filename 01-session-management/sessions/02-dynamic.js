const express = require('express')
const session = require('express-session')

const app = express()
const port = 3000

var session_options = {
    secret: "some_randomly_generated_string_here!",
    cookie: {
        secure: "auto",
        maxAge: 15000
    },
    resave: false,
    saveUninitialized: false,
    rolling: false,
}

app.use(session(session_options))

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    var response_html =
        "<h1>Hello World!</h1>" +
        "<hr>"
    if (!req.session.initialized) {
        response_html +=
            "<p>You are logged out!</p>" +
            "<form action='/' method='post'>" +
            "<input type='submit' name='login' value='LOG IN'/>" +
            "</form>"
    } else {
        var ms_to_expiry = req.session.original_expiry - Date.now()
        response_html +=
            "<p>You are logged in!</p>" +
            "<ul>" +
            "<li>session_id: " + req.session.id + "</li>" +
            "<li>expiry: " + ms_to_expiry/1000 + "s (" + req.session.original_expiry_str + ") </li>" +
            "</ul>" +
            "<form action='/' method='post'>" +
            "<input type='submit' value='REFRESH PAGE'/></br>" +
            "<input type='submit' name='refresh' value='REFRESH EXPIRY'/></br></br></br>" +
            "<input type='submit' name='logout' value='LOG OUT'/>" +
            "</form>"
    }

    res.write(response_html)
    res.end()
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/', (req, res) => {
    if (req.body.login) {
        if (req.session.initialized) {
            console.log("ERROR: login after being initialized!")
        }
        req.session.initialized = true
        req.session.original_expiry = Date.parse(req.session.cookie.expires)
        req.session.original_expiry_str = new Date(req.session.original_expiry).toLocaleString("en-GB")
        req.session.refresh_flag = false
    } else if (req.body.logout) {
        req.session.regenerate((err) => { } )
    } else if (req.body.refresh) {
        req.session.refresh_flag = !req.session.refresh_flag
        req.session.original_expiry = Date.now() + req.session.cookie.originalMaxAge
        req.session.original_expiry_str = new Date(req.session.original_expiry).toLocaleString("en-GB")
    }

    res.redirect('/')
    res.end()
})

app.listen(port, () => {
    console.log(`Dynamic Sessions app listening at http://localhost:${port}`)
})
