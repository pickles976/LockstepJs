console.log("Starting Server...")

import { WebSocketServer } from 'ws';

let sequential_id = 0;
let clientList = {};
let latencies = {};

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

  ws.on('close', function close() {
    delete clientList[ws.id];
  })

  handleHandshake(ws)

  clientList[ws.id] = true;
  wss.sendAll({ type: "MSSG", data : clientList});

//   wss.sendAll({ type: "TREQ", data : {}});

//   ws.send('Connected');


});

// TODO: we need to do this multiple times, over the course of a few seconds
// then average them to get our sync values
function handleHandshake(ws) {

    let time_sent = Date.now()

    ws.on('message', function message(data) {
        data = JSON.parse(data)
        console.log(data)
        let time_rcvd = data
        let time_rtrnd = Date.now()

        let round_trip = time_rtrnd - time_sent
        let latency = round_trip / 2
        let clock_diff = time_rcvd - time_sent - latency

        console.log(`Latency: ${latency}ms`)
        console.log(`Clock diff: ${clock_diff}ms`)

    });

    time_sent = Date.now()
    ws.send(JSON.stringify({ type: "TREQ", data : {}}), {binary: false})
}
