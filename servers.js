const fs = require('fs');
const url = require('url');
const wss = require('ws');
const http = require('http');
const mime = require('mime-types');
const https = require('https');
const hashFunc = require('argon2');
const domainName = 'passthepotion.com';
const serverIP = 'passthepotion.com';
let db = {};
db.files = {
    'landing.html': fs.readFileSync('database/html/landing.html'),
    'landing.js': fs.readFileSync('database/js/landing.js'),
    'landing.css': fs.readFileSync('database/css/landing.css'),
    'main.html': fs.readFileSync('database/html/main.html'),
    'main.js': fs.readFileSync('database/js/main.js'),
    'main.css': fs.readFileSync('database/css/main.css')
};
db.users = JSON.parse(fs.readFileSync('database/users/main.json'));
const hashSessionPromise = (sessionFor) => {
    return new Promise((resolve, reject) => {
        var hashTimeout = setTimeout(() => {
            reject('hashTimeout');
        }, 10000);
        hashFunc.hash(sessionFor, {
            timeCost: 3,
            memoryCost: 12,
            parallelism: 4,
            raw: true
        }).then(hash => {
            clearTimeout(hashTimeout);
            resolve(hash.toString('base64'));
        });
    });
};
const hashPasswordPromise = (password) => {
    return new Promise((resolve, reject) => {
        var hashTimeout = setTimeout(() => {
            reject('hashTimeout');
        }, 10000);
        hashFunc.hash(password, {
            timeCost: 3,
            memoryCost: 12,
            parallelism: 4
        }).then(hash => {
            clearTimeout(hashTimeout);
            resolve(hash);
        });
    });
};
const checkPasswordHashPromise = (password, hash) => {
    return new Promise((resolve, reject) => {
        hashFunc.verify(hash, password).then(match => {
            if (match) {
                resolve('match');
            } else {
                reject('no match');
            }
        }).catch(err => {
            reject(err);
        });
    });
};
let httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/' + domainName + '/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/' + domainName + '/fullchain.pem')
}, (req, res) => {
    console.log(req.url);
    var accessableFiles = Object.keys(db.files);
    var fileIndex = accessableFiles.indexOf(req.url.replace('/', ''));
    if (fileIndex != -1) {
        var reqFile = accessableFiles[fileIndex];
        res.setHeader('content-type', mime.lookup(reqFile));
        res.end(db.files[reqFile]);
    } else {
        if (req.url == '/') {
            res.setHeader('Content-Type', 'text/html');
            res.end(db.files['landing.html']);
        } else {
            res.end();
        }
    }
}).listen(443, serverIP);
let httpServer = http.createServer((req, res) => {
    res.writeHead(302, {
        'Location': 'https://' + domainName
    });
    res.end('Upgrade your browser to allow for HTTPS(secure) traffic.');
}).listen(80, serverIP);
let wssServer = new wss.Server({
    server: httpsServer,
    verifyClient: (info) => {
        if (info.origin == 'https://' + domainName) {
            return true;
        } else {
            return false;
        }
    }
});
wssServer.on('connection', (clientSocket, req) => {
    clientSocket.on('message', (message) => {
        try {
            var fromServer = JSON.parse(message);
            console.log(fromServer);
            switch (fromServer.type) {
                case 'register':
                    {
                        var a9 = fromServer.registerUsername.match(/[a-zA-Z0-9]{3,20}$/);
                        var pw = fromServer.registerPassword.match(/.{10,125}$/);
                        if (a9 != null && a9.index == 0 && Object.keys(db.users).indexOf(fromServer.registerUsername) == -1 && pw != null && pw.index == 0 && fromServer.registerPassword == fromServer.registerRepassword) {
                            hashPasswordPromise(fromServer.registerPassword).then(hash => {
                                db.users[fromServer.registerUsername] = {
                                    'hash': hash,
                                    'joined': Date.now(),
                                    'uses': 0,
                                    'ip': req.connection.remoteAddress
                                };
                                return hashSessionPromise(hash);
                            }).then(hash => {
                                db.users[fromServer.registerUsername].session = hash;
                                clientSocket.send(JSON.stringify({ 'type': 'registerSuccess' }));
                                clientSocket.send(JSON.stringify({ 'type': 'sessionUpdate', 'session': hash }));
                                db.users[fromServer.registerUsername].lastActive = Date.now();
                                db.users[fromServer.registerUsername].uses = db.users[fromServer.registerUsername].uses + 1;
                                console.log(db.users);
                            }).catch((error) => {
                                clientSocket.send(JSON.stringify({ 'type': 'registerFail' }));
                                console.log(error);
                            });
                        } else {
                            clientSocket.send(JSON.stringify({ 'type': 'registerFail' }));
                        }
                        break;
                    }
                case 'login':
                    {
                        var a9 = fromServer.loginUsername.match(/[a-zA-Z0-9]{3,20}$/);
                        var pw = fromServer.loginPassword.match(/.{10,125}$/);
                        if (a9 != null && a9.index == 0 && pw != null && pw.index == 0 && Object.keys(db.users).indexOf(fromServer.loginUsername) != -1) {
                            checkPasswordHashPromise(fromServer.loginPassword, db.users[fromServer.loginUsername].hash).then(matchStatus => {
                                return hashSessionPromise(db.users[fromServer.loginUsername].hash);
                            }).then(hash => {
                                db.users[fromServer.loginUsername].session = hash;
                                clientSocket.send(JSON.stringify({ 'type': 'loginSuccess' }));
                                clientSocket.send(JSON.stringify({ 'type': 'sessionUpdate', 'session': hash }));
                                db.users[fromServer.loginUsername].lastActive = Date.now();
                                db.users[fromServer.loginUsername].uses = db.users[fromServer.loginUsername].uses + 1;
                                console.log(db.users);
                            }).catch((error) => {
                                clientSocket.send(JSON.stringify({ 'type': 'loginFail' }));
                                console.log(error);
                            });
                        } else {
                            clientSocket.send(JSON.stringify({ 'type': 'loginFail' }));
                        }
                        break;
                    }
                default:
                    {
                        console.log('weird message: ${message}');
                    }
            }
        } catch (error) {
            console.log('weird message: ${message}');
        }
    });
    clientSocket.on('close', () => {});
});
process.stdin.resume();

let exitHandler = (options, err) => {
    if (options.backup) fs.writeFileSync('database/users/main.json', JSON.stringify(db.users));
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, { backup: true }));

process.on('SIGINT', exitHandler.bind(null, { exit: true }));

process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
