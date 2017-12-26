console.log('Creating socket');
let ws = new WebSocket('ws://localhost:8090/');
ws.onopen = function() {

    console.log('Socket open.');
    ws.send(JSON.stringify({message: 'What is the meaning of life, the universe and everything?'}));
    console.log('Message sent.')
};
ws.onmessage = function(message) {

    console.log('Socket server message', message);
    let data = JSON.parse(message.data);
    document.getElementById('response').innerHTML = JSON.stringify(data, null, 2);
};

export default ws;