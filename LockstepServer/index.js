console.log("Starting Server...")

import { WebSocketServer } from 'ws';

let sequential_id = 0;
let clientList = {};

const wss = new WebSocketServer({ port: 8080 });

wss.getUniqueID = function() {
    sequential_id++;
    return sequential_id
}

wss.sendAll = function(data) {
    this.clients.forEach((client) => {
        client.send(JSON.stringify(data), {binary: false})
    })
}

wss.on('connection', function connection(ws) {

  ws.id = wss.getUniqueID();

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);

    // Forward data to all clients
  });

  ws.on('close', function close() {
    delete clientList[ws.id];
  })

  clientList[ws.id] = true;
  wss.sendAll(clientList);

//   ws.send('Connected');


});
