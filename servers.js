const mime = require('mime-types');
const domainName = 'YOURDOMAINNAMEHERE';
const wss = require('ws');
const fs = require('fs');
const http = require('http');
const https = require('https');
let database = {};
database.files = {
    'main.html': fs.readFileSync('database/html/main.html'),
    'main.js': fs.readFileSync('database/js/main.js'),
    'main.css': fs.readFileSync('database/css/main.css')
};
database.wssMessages = fs.readFileSync('database/wssMessages/main.json');
database.backup = {};
database.backup.wssMessages = database.wssMessages;

let httpsServer = https.createServer({
    key: fs.readFileSync(`/etc/letsencrypt/live/${domainName}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${domainName}/fullchain.pem`)
}, (req, res) => {
    let accessableFiles = Object.keys(database.files);
    let fileIndex = accessableFiles.indexOf(req.url.replace('/', ''));
    if (fileIndex !== -1) {
        let reqFile = accessableFiles[fileIndex];
        res.setHeader('content-type', mime.lookup(reqFile));
        res.end(database.files[reqFile]);
    } else {
        if (req.url === '/' || req.url === '/index' || req.url === '/index.html' || req.url === '/main' || req.url === '/main.html') {
            res.setHeader('Content-Type', 'text/html');
            res.end(database.files['main.html']);
        } else {
            res.writeHead(404);
            res.end('What chu lookin for?');
        }
    }
}).listen(443, domainName);
let httpServer = http.createServer((req, res) => {
    res.writeHead(302, {
        'Location': 'https://' + domainName
    });
    res.end('Upgrade your browser to allow for HTTPS(secure) traffic.');
}).listen(80, domainName);
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
    clientSocket.send('Welcome.');
    let timestamp = new Date().getTime();
    let messageIndex = Object.keys(database.wssMessages).length;
    let from = req.connection.remoteAddress;
    database.wssMessages[messageIndex] = {
        from: from,
        message: 'JOIN',
        timestamp: timestamp
    };
    database.backup.wssMessages[messageIndex] = {
        from: from,
        message: 'JOIN',
        timestamp: timestamp
    };
    clientSocket.on('message', (message) => {
        database.wssMessages[messageIndex] = {
            from: from,
            message: message,
            timestamp: timestamp
        };
        database.backup.wssMessages[messageIndex] = {
            from: from,
            message: message,
            timestamp: timestamp
        };
    });
    clientSocket.on('close', () => {
        database.wssMessages[messageIndex] = {
            from: from,
            message: 'PART',
            timestamp: timestamp
        };
        database.backup.wssMessages[messageIndex] = {
            from: from,
            message: 'PART',
            timestamp: timestamp
        };
    });
});
process.stdin.resume();
let exitHandler = (options, err) => {
    if (options.backup) fs.writeFileSync(`database/backup/main-${new Date().getTime()}.json`, JSON.stringify(database.backup));
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null, { backup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));