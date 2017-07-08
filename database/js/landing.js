const establishConnectionPromise = (domainName, timeout) => {
    return new Promise((resolve, reject) => {
        var socketTimeout = setTimeout(() => {
            reject({
                type: 'socketTimeout'
            });
        }, timeout);
        var socket = new WebSocket('wss://' + domainName);
        socket.addEventListener('message', (event) => {
            try {
                var serverMessage = JSON.parse(event.data);
                switch (serverMessage.type) {
                    case 'registerFail':
                        {
                            alert('Failed to register, try again.\n\nYour username can only contain characters a-z, A-Z, and 0-9.\nYour username must be 3-20 characters in length.\n\nYour password can be made up of any characters, but it must be 10-125 characters long. Make it secure.');
                            break;
                        }
                    case 'loginFail':
                        {
                            alert('Failed to login, try again.');
                            break;
                        }
                    case 'registerSuccess':
                        {
                            alert('You are registered and logged in.');
                            break;
                        }
                    case 'loginSuccess':
                        {
                            alert('You are logged in.');
                            break;
                        }
                    case 'sessionUpdate':
                        {

                            localStorage.setItem('dumbSession', serverMessage.session)
                            break;
                        }
                    default:
                        {
                            console.log(`weird message from server: ${serverMessage}`)
                        }
                }
            } catch (error) {
                console.log(error);
            }
        });
        socket.addEventListener('close', (event) => {});
        socket.addEventListener('error', (event) => {});
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
        if (localStorage.getItem('test') == 'test') {
            localStorage.removeItem('test');
            clearTimeout(storageTimeout);
            resolve();
        }
    });
};
document.addEventListener('DOMContentLoaded', () => {
    let socket = undefined;
    establishConnectionPromise('', 10000)
        .then((newSocket) => {
            socket = newSocket;
            return establishStoragePromise(3000);
        }).then(() => {
            let loginSubmitElement = document.querySelector('#loginSubmit');
            let loginUsernameElement = document.querySelector('#loginUsername');
            let loginPasswordElement = document.querySelector('#loginPassword');
            let registerSubmitElement = document.querySelector('#registerSubmit');
            let registerUsernameElement = document.querySelector('#registerUsername');
            let registerPasswordElement = document.querySelector('#registerPassword');
            let registerRepasswordElement = document.querySelector('#registerRepassword');
            loginSubmitElement.addEventListener('click', (event) => {
                event.preventDefault();
                socket.send(JSON.stringify({ type: 'login', loginUsername: loginUsernameElement.value, loginPassword: loginPasswordElement.value }));
            }, false);
            loginUsernameElement.onkeyup = () => {
                var loginUsernameElementState = loginUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var loginPasswordElementState = loginPasswordElement.value.match(/.{10,125}$/);
                if (loginUsernameElementState == null) {
                    loginUsernameElement.style['background-color'] = '#F44336';
                    loginUsernameElement.style['color'] = 'white';
                    loginSubmitElement.style['background-color'] = '#F44336';
                    loginSubmitElement.style['color'] = 'white';
                } else {
                    if (loginUsernameElementState.index != 0) {
                        loginUsernameElement.style['background-color'] = '#F44336';
                        loginUsernameElement.style['color'] = 'white';
                        loginSubmitElement.style['background-color'] = '#F44336';
                        loginSubmitElement.style['color'] = 'white';
                    } else {
                        loginUsernameElement.style['background-color'] = '#4CAF50';
                        loginUsernameElement.style['color'] = 'white';
                        if (loginPasswordElementState != null && loginPasswordElementState.index == 0) {
                            loginSubmitElement.style['background-color'] = '#4CAF50';
                            loginSubmitElement.style['color'] = 'white';
                        } else {
                            loginSubmitElement.style['background-color'] = '#F44336';
                            loginSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            loginUsernameElement.onfocus = () => {
                var loginUsernameElementState = loginUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var loginPasswordElementState = loginPasswordElement.value.match(/.{10,125}$/);
                if (loginUsernameElementState == null) {
                    loginUsernameElement.style['background-color'] = '#F44336';
                    loginUsernameElement.style['color'] = 'white';
                    loginSubmitElement.style['background-color'] = '#F44336';
                    loginSubmitElement.style['color'] = 'white';
                } else {
                    if (loginUsernameElementState.index != 0) {
                        loginUsernameElement.style['background-color'] = '#F44336';
                        loginUsernameElement.style['color'] = 'white';
                        loginSubmitElement.style['background-color'] = '#F44336';
                        loginSubmitElement.style['color'] = 'white';
                    } else {
                        loginUsernameElement.style['background-color'] = '#4CAF50';
                        loginUsernameElement.style['color'] = 'white';
                        if (loginPasswordElementState != null && loginPasswordElementState.index == 0) {
                            loginSubmitElement.style['background-color'] = '#4CAF50';
                            loginSubmitElement.style['color'] = 'white';
                        } else {
                            loginSubmitElement.style['background-color'] = '#F44336';
                            loginSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            loginPasswordElement.onkeyup = () => {
                var loginPasswordElementState = loginPasswordElement.value.match(/.{10,125}$/);
                var loginUsernameElementState = loginUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                if (loginPasswordElementState == null) {
                    loginPasswordElement.style['background-color'] = '#F44336';
                    loginPasswordElement.style['color'] = 'white';
                    loginSubmitElement.style['background-color'] = '#F44336';
                    loginSubmitElement.style['color'] = 'white';
                } else {
                    if (loginPasswordElementState.index != 0) {
                        loginPasswordElement.style['background-color'] = '#F44336';
                        loginPasswordElement.style['color'] = 'white';
                        loginSubmitElement.style['background-color'] = '#F44336';
                        loginSubmitElement.style['color'] = 'white';
                    } else {
                        loginPasswordElement.style['background-color'] = '#4CAF50';
                        loginPasswordElement.style['color'] = 'white';
                        if (loginUsernameElementState != null && loginUsernameElementState.index == 0) {
                            loginSubmitElement.style['background-color'] = '#4CAF50';
                            loginSubmitElement.style['color'] = 'white';
                        } else {
                            loginSubmitElement.style['background-color'] = '#F44336';
                            loginSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            loginPasswordElement.onfocus = () => {
                var loginPasswordElementState = loginPasswordElement.value.match(/.{10,125}$/);
                var loginUsernameElementState = loginUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                if (loginPasswordElementState == null) {
                    loginPasswordElement.style['background-color'] = '#F44336';
                    loginPasswordElement.style['color'] = 'white';
                    loginSubmitElement.style['background-color'] = '#F44336';
                    loginSubmitElement.style['color'] = 'white';
                } else {
                    if (loginPasswordElementState.index != 0) {
                        loginPasswordElement.style['background-color'] = '#F44336';
                        loginPasswordElement.style['color'] = 'white';
                        loginSubmitElement.style['background-color'] = '#F44336';
                        loginSubmitElement.style['color'] = 'white';
                    } else {
                        loginPasswordElement.style['background-color'] = '#4CAF50';
                        loginPasswordElement.style['color'] = 'white';
                        if (loginUsernameElementState != null && loginUsernameElementState.index == 0) {
                            loginSubmitElement.style['background-color'] = '#4CAF50';
                            loginSubmitElement.style['color'] = 'white';
                        } else {
                            loginSubmitElement.style['background-color'] = '#F44336';
                            loginSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerSubmitElement.addEventListener('click', (event) => {
                event.preventDefault();
                socket.send(JSON.stringify({ type: 'register', registerUsername: registerUsernameElement.value, registerPassword: registerPasswordElement.value, registerRepassword: registerRepasswordElement.value }));
            }, false);
            registerUsernameElement.onkeyup = () => {
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                if (registerUsernameElementState == null) {
                    registerUsernameElement.style['background-color'] = '#F44336';
                    registerUsernameElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerUsernameElementState.index != 0) {
                        registerUsernameElement.style['background-color'] = '#F44336';
                        registerUsernameElement.style['color'] = 'white';
                    } else {
                        registerUsernameElement.style['background-color'] = '#4CAF50';
                        registerUsernameElement.style['color'] = 'white';
                        if (registerPasswordElementState != null && registerPasswordElementState.index == 0 && registerRepasswordElementState != null && registerRepasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerUsernameElement.onfocus = () => {
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                if (registerUsernameElementState == null) {
                    registerUsernameElement.style['background-color'] = '#F44336';
                    registerUsernameElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerUsernameElementState.index != 0) {
                        registerUsernameElement.style['background-color'] = '#F44336';
                        registerUsernameElement.style['color'] = 'white';
                    } else {
                        registerUsernameElement.style['background-color'] = '#4CAF50';
                        registerUsernameElement.style['color'] = 'white';
                        if (registerPasswordElementState != null && registerPasswordElementState.index == 0 && registerRepasswordElementState != null && registerRepasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerPasswordElement.onkeyup = () => {
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                if (registerPasswordElementState == null) {
                    registerPasswordElement.style['background-color'] = '#F44336';
                    registerPasswordElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerPasswordElementState.index != 0) {
                        registerPasswordElement.style['background-color'] = '#F44336';
                        registerPasswordElement.style['color'] = 'white';
                    } else {
                        registerPasswordElement.style['background-color'] = '#4CAF50';
                        registerPasswordElement.style['color'] = 'white';
                        if (registerUsernameElementState != null && registerUsernameElementState.index == 0 && registerRepasswordElementState != null && registerRepasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerPasswordElement.onfocus = () => {
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                if (registerPasswordElementState == null) {
                    registerPasswordElement.style['background-color'] = '#F44336';
                    registerPasswordElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerPasswordElementState.index != 0) {
                        registerPasswordElement.style['background-color'] = '#F44336';
                        registerPasswordElement.style['color'] = 'white';
                    } else {
                        registerPasswordElement.style['background-color'] = '#4CAF50';
                        registerPasswordElement.style['color'] = 'white';
                        if (registerUsernameElementState != null && registerUsernameElementState.index == 0 && registerRepasswordElementState != null && registerRepasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerRepasswordElement.onkeyup = () => {
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                if (registerRepasswordElementState == null) {
                    registerRepasswordElement.style['background-color'] = '#F44336';
                    registerRepasswordElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerRepasswordElementState.index != 0) {
                        registerRepasswordElement.style['background-color'] = '#F44336';
                        registerRepasswordElement.style['color'] = 'white';
                    } else {
                        registerRepasswordElement.style['background-color'] = '#4CAF50';
                        registerRepasswordElement.style['color'] = 'white';
                        if (registerUsernameElementState != null && registerUsernameElementState.index == 0 && registerPasswordElementState != null && registerPasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
            registerRepasswordElement.onfocus = () => {
                var registerRepasswordElementState = registerRepasswordElement.value.match(/.{10,125}$/);
                var registerUsernameElementState = registerUsernameElement.value.match(/[a-zA-Z0-9]{3,20}$/);
                var registerPasswordElementState = registerPasswordElement.value.match(/.{10,125}$/);
                if (registerRepasswordElementState == null) {
                    registerRepasswordElement.style['background-color'] = '#F44336';
                    registerRepasswordElement.style['color'] = 'white';
                    registerSubmitElement.style['background-color'] = '#F44336';
                    registerSubmitElement.style['color'] = 'white';
                } else {
                    if (registerRepasswordElementState.index != 0) {
                        registerRepasswordElement.style['background-color'] = '#F44336';
                        registerRepasswordElement.style['color'] = 'white';
                    } else {
                        registerRepasswordElement.style['background-color'] = '#4CAF50';
                        registerRepasswordElement.style['color'] = 'white';
                        if (registerUsernameElementState != null && registerUsernameElementState.index == 0 && registerPasswordElementState != null && registerPasswordElementState.index == 0) {
                            registerSubmitElement.style['background-color'] = '#4CAF50';
                            registerSubmitElement.style['color'] = 'white';
                        } else {
                            registerSubmitElement.style['background-color'] = '#F44336';
                            registerSubmitElement.style['color'] = 'white';
                        }
                    }
                }
            };
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
