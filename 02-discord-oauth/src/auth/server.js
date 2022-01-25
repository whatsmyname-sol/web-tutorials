const express = require('express')
const session = require('express-session')
const discordOAuth2 = require('discord-oauth2')

const app = express()
const port = 3000

var session_options = {
    secret: "some_randomly_generated_string_here!",
    cookie: {
        secure: "auto",
        maxAge: 1 * 60 * 1000, // 1 minute
    },
    resave: false,
    saveUninitialized: true,
    rolling: true,
}

app.use(session(session_options))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

const { clientId, clientSecret } = require('../../config.json')
const oauth = new discordOAuth2({
    clientId: clientId,
    clientSecret: clientSecret,
    redirectUri: `http://localhost:${port}/`,
})

app.get('/', (req, res) => {
    if (req.query.code) {
        if (req.query.state != req.session.id) {
            console.error("State does not match Session ID!")
        } else {
            req.session.access = { code: req.query.code }
            req.session.cookie.maxAge = 1 * 365 * 24 * 60 * 60 * 1000 // 1 year
        }
        res.redirect('/')
        return
    }

    if (req.query.error) {
        console.error(`${req.query.error}: ${req.query.error_description}`)
        res.redirect('/')
        return
    }

    if (!req.session.access || !req.session.access.code) {
        let oauthURL = oauth.generateAuthUrl({
            prompt: 'none',
            scope: ['identify'],
            state: req.session.id
        })
        res.render('login', { oauthURL : oauthURL } )
    } else {
        let tokenRequest = null
        
        if (!req.session.access.token) {
            tokenRequest = {
                code: req.session.access.code,
                scope: 'identify',
                grantType: 'authorization_code'
            }
            console.log(`${req.session.id}: requesting access token via access code`)
        } else if (req.session.access.token_expiry < (new Date()).getTime()) {
            console.log(`${req.session.id}: requesting access token with refresh token`)
            tokenRequest = {
                refreshToken: req.session.access.refresh_token,
                scope: 'identify',
                grantType: 'refresh_token'
            }
        }
        
        if (tokenRequest) {
            oauth.tokenRequest(tokenRequest)
                .then(tokenRes => {
                    req.session.access.token = tokenRes['access_token']
                    req.session.access.refresh_token = tokenRes['refresh_token']
                    req.session.access.token_expiry = (new Date()).getTime() + (15 * 1000)
                    // req.session.access.token_expiry = (new Date()).getTime() + (tokenRes['expires_in'] * 1000)
        
                    console.log(`${req.session.id}: received access token`)
                    console.log(req.session.access)
                })
                .catch(err => {
                    console.error(err.message)
                    console.error(err.response)
        
                    req.session.access = null
                    res.clearCookie('discord.oauth.code')
                })
                .then(() => {
                    res.redirect('/')
                    res.end()
                })
        } else {
            oauth.getUser(req.session.access.token)
                .then(response => {
                    console.log(response)
                    res.render('profile', response)
                })
                .catch(err => {
                    console.log(err.response)
                    res.end()
                })
        }
    }
})

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/', (req, res) => {
    if (req.body.logout) {
        req.session.access = null
        req.session.destroy(console.error)
    }
    res.redirect('/')
    res.end()
})

app.listen(port, () => {
    console.log(`Authorization Code Grant Flow app listening at http://localhost:${port}`)
})
