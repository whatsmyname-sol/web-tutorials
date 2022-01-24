const express = require('express')

const app = express()
const port = 3000

function encodeQueryData(data) {
    const ret = [];
    for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
}

const { clientId } = require('../../config.json')
const oauthParameters = {
    client_id: clientId,
    redirect_uri: `http://localhost:${port}/`,
    response_type: 'token',
    scope: ['identify', 'email', 'guilds'].join(' '),
}
const oauthURL = `https://discord.com/api/oauth2/authorize?${encodeQueryData(oauthParameters)}`

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('index', { oauthURL: oauthURL })
})

app.listen(port, () => {
    console.log(`Implicit Grant Flow app listening at http://localhost:${port}`)
    console.log(`OAuth2 URL is ${oauthURL}`)
})
