console.log("Starting Server...")

import { WebSocketServer } from 'ws';
import { Synchronizer } from './synchronizer.js';
import { sleep } from './util.js';

const MAX_HANDSHAKES = 5;
const HANDSHAKE_INTERVAL = 250

let sequential_id = 0;
let clientList = {};

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
    delete clientList[ws.id];
  })

  ws.on('message', function message(data) {
    data = JSON.parse(data)
    handleMessage(ws, data);
  });

  // Show client is connecting
  clientList[ws.id] = false;
  wss.sendAll({ type: "MSSG", data : clientList});

  // add our client to the sycnhronizer
  synchronizer.addClient(ws);
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
            break;
        case "MSSG":
            // TODO: forward to all other clients
            break;
        case "CMND":
            // TODO: forward to all other clients
            break;
        default:
            break;
    }

}