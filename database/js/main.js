const establishConnectionPromise = (domainName, timeout) => {
    return new Promise((resolve, reject) => {
        var socketTimeout = setTimeout(() => {
            reject({
                type: 'socketTimeout'
            });
        }, timeout);
        var socket = new WebSocket(`wss://${domainName}`);
        socket.addEventListener('message', (event) => {
            socket.send(`got message: ${event}`);
        });
        socket.addEventListener('close', (event) => {});
        socket.addEventListener('error', (event) => {
            socket.send(`got error: ${event}`);
        });
        socket.addEventListener('open', () => {
            clearTimeout(socketTimeout);
            resolve(socket);
        });
    });
};

const establishStoragePromise = (timeout) => {
    return new Promise((resolve, reject) => {
        var storageTimeout = setTimeout(() => {
            reject({
                type: 'storageTimeout'
            });
        }, timeout);
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        localStorage.setItem('test', 'test');
        if (localStorage.getItem('test') === 'test') {
            localStorage.removeItem('test');
            clearTimeout(storageTimeout);
            resolve();
        }
    });
};
document.addEventListener('DOMContentLoaded', () => {
    let socket = undefined;
    establishConnectionPromise('YOURDOMAINNAMEHERE', 10000).then((newSocket) => {
        socket = newSocket;
        return establishStoragePromise(3000);
    }).then(() => {
        console.log('ready for anything.');
    }).catch(error => {
        switch (error.type) {
            case 'socketTimeout':
                {
                    console.log(error);
                    break;
                }
            case 'storageTimeout':
                {
                    console.log(error);
                    break;
                }
            default:
                {
                    console.log(error);
                }
        }
    });
});