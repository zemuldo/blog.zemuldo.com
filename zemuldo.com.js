let express = require('express');
let path = require('path');
let  app = express();
let bodyParser = require('body-parser');
let helmet = require('helmet')
let checkMe = require('cookie-session')
let ENV = require('./config/env');
let env = ENV().raw.NODE_ENV
const conf = require('./config/conf')



app.use(bodyParser.json());
app.use(helmet())
app.set('x-powered-by',false)
app.set('X-Powered-By',false)
app.use(helmet.ieNoOpen())
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet({
    frameguard: false,
    noCache:true
}))

let expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(checkMe({
    name: 'session',
    keys: ['themati#@tripple26=n26gohb()@#$$#$THF$%^$FGDFRFU', '#$THF$%^$FGDFRFU26gohb()@#i#@tripple26='],
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'zemuldo.com',
        path: '/',
        expires: expiryDate
    }
}))

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
console.log(conf[env].httpPort)
app.listen(conf[env].httpPort,()=>{
    console.log("**Server started at http://localhost:"+conf[env].httpPort)
});