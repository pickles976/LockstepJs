console.log("Starting Server...")

import { WebSocketServer } from 'ws';
import { Synchronizer } from './synchronizer.js';
import { sleep } from './util.js';

const MAX_HANDSHAKES = 5;
const HANDSHAKE_INTERVAL = 250

let sequential_id = 0;

const wss = new WebSocketServer({ port: 8080 });
const synchronizer = new Synchronizer();

wss.getUniqueID = function() {
    sequential_id++;
    return sequential_id
}

wss.sendAll = function(data) {
    this.clients.forEach((client) => {
        client.send(JSON.stringify(data), {binary: false})
    })
}

wss.sendAllExceptOrigin = function(data, ws) {
    this.clients.forEach((client) => {
        if (client.id != ws.id) {
            client.send(JSON.stringify(data), {binary: false})
        }
    })
}

wss.on('connection', function connection(ws) {

  ws.id = wss.getUniqueID();

  ws.on('error', console.error);

  ws.on('close', function close() {
    synchronizer.disconnectClient(ws);
    ws.removeAllListeners('message');
  })

  ws.on('message', function message(data) {
    data = JSON.parse(data)
    handleMessage(ws, data);
  });

  // add our client to the synchronizer
  synchronizer.addClient(ws);
  // Show client is connecting
  wss.sendAll({ type: "MSSG", data : synchronizer.clients});
  
  // start a handshake loop
  console.log(`Synchronizing client ${ws.id} clock...`)
  synchronizer.timeRequest(ws);

});

function handleMessage(ws, packet) {

    switch(packet.type) {
        case "TRES":
            // Process the time response
            synchronizer.timeResponse(ws, packet);

            if (synchronizer.handshakeFinished(ws)) {
                synchronizer.startClientTimer(ws); // handshake over, start the timer
            } else {
                sleep(HANDSHAKE_INTERVAL).then(() => {
                    synchronizer.timeRequest(ws); // sleep then perform another time request
                })
            }
            break;
        case "SUCC":
            synchronizer.handleClientTimerSuccess(ws);
            wss.sendAll({ type: "MSSG", data : synchronizer.clients});
            break;
        case "MSSG":
            wss.sendAllExceptOrigin(packet, ws);
            break;
        case "CMND":
            // To keep logic simple, users "fire and forget" their own
            // commands, and receive them the same way as everyone else
            wss.sendAll(packet);
            break;
        default:
            break;
    }

}