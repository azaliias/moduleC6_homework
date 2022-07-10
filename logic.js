const wsUri = "wss://echo-ws-service.herokuapp.com/";

const output = document.getElementById("output");
const message = document.querySelector('.message');
const btnSend = document.querySelector('.btnSend');
const btnLocation = document.querySelector('.location');
const btnStart = document.querySelector('.start');

let websocket;

const error = () => {
    writeToScreen('Невозможно получить ваше местоположение', true);
}

const success = (position) => {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let mapLink = document.createElement("a");
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.target = '_blank';
    mapLink.textContent = 'Гео-локация';
    mapLink.style.textAlign = "end";
    output.appendChild(mapLink);
}

btnStart.addEventListener('click', () => {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        console.log('CONNECTED', true);
        btnStart.style.display = "none";
        writeToScreen("Соединениe установлено. Введите сообщение", true);
    };
    websocket.onclose = function(evt) {
        console.log('DISCONNECTED');
        writeToScreen("DISCONNECTED", true);
    };
    websocket.onmessage = function(evt) {
        console.log(evt.data);
        writeToScreen(
            '<span style="color: green;">Сообщение от сервера: ' + evt.data+'</span>', true
        );
    };
    websocket.onerror = function(evt) {
        console.log(evt.data);
        writeToScreen(
            '<span style="color: red;">ERROR:</span> ' + evt.data
        );
    };
});

btnSend.addEventListener('click', () => {
    if(websocket !== undefined){
        writeToScreen(
            '<span style="color: blue;">Сообщение отправителя: ' + message.value+'</span>'
            );
        websocket.send(message.value);
        message.value = '';
    }else {
        writeToScreen(
            '<span style="color: green;">Нажмите на кнопку "Начать общение" и отправьте сообщение</span>'
        );
    }
    
});

btnLocation.addEventListener('click', () => {
    if(websocket !== undefined){
        if (!navigator.geolocation) {
            writeToScreen("Geolocation не поддерживается вашим браузером");
          } else {
            navigator.geolocation.getCurrentPosition(success, error);
          }
    }else {
        writeToScreen(
            '<span style="color: green;">Сначала нажмите на кнопку "Начать общение" и отправьте сообщение</span>'
        );
    }
    
});

function writeToScreen(message, res = false) {
    let pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    if(res){
        pre.style.textAlign = "end";
    }
    pre.innerHTML = message;
    output.appendChild(pre);
}