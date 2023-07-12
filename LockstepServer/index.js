console.log("Starting Server...")

import { WebSocketServer } from 'ws';

const MAX_HANDSHAKES = 5;

let sequential_id = 0;
let clientList = {};
let epoch_time = Date.now()
let time_0 = Date.now()

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

  handshake(ws)

  // Show client is connecting
  clientList[ws.id] = false;
  wss.sendAll({ type: "MSSG", data : clientList});

});

// 1. Handshake - find client latency and timer offset
// 2. Synchronize - synchronize client clock to server time
// 3. Ready - forward all incoming commands to every other client

function handshake(ws) {

    console.log(`Synchronizing client clock ${ws.id}`)
    let latencies = []
    let offsets = []
    let i = 0

    // TODO: consolidate these into a switch statement
    ws.on('message', function message(data) {

        data = JSON.parse(data)

        let time_1 = data
        let time_2 = Date.now()

        let round_trip = time_2 - time_0
        let latency = round_trip / 2
        let clock_diff = (time_2 - latency) - time_1
        console.log(`Latency: ${latency}ms`)
        console.log(`Clock diff: ${clock_diff}ms`)

        latencies.push(latency)
        offsets.push(clock_diff)

        i++
        if (i < MAX_HANDSHAKES) {
            sleep(500).then(() => {
                time_0 = Date.now()
                ws.send(JSON.stringify({ type: "TREQ", data : {}}), {binary: false})
            })
        } else {
            console.log(`Latencies: ${latencies}`)
            console.log(`Clock diffs: ${offsets}`)
            const mean_latency = latencies.reduce(function (acc, curr){
                return acc + curr;
              }, 0) / latencies.length;
            const mean_diff = offsets.reduce(function (acc, curr){
                return acc + curr;
              }, 0) / offsets.length;
            ws.latency = mean_latency
            ws.clock_diff = mean_diff
            synchronize(ws)
        }
    });

    time_0 = Date.now()
    ws.send(JSON.stringify({ type: "TREQ", data : {}}), {binary: false})
}

function synchronize(ws) {

    // listen for success message
    ws.on('message', function message(data) {
        data = JSON.parse(data)
        if (data.type == "SUCC") {
            ready(ws)
        } else {
            console.log(`Client ${ws.id} unable to sync`);
        }
    });

    // Tell client to start game timer
    ws.send(JSON.stringify({ type: "STRT", data : { latency: ws.latency, offset: ws.clock_diff, epoch: epoch_time }}), {binary: false})
    console.log("Sending client sync packet")
}

function ready(ws) {

    ws.on('message', function message(data) {
        // forward packet to all clients except for sender
        wss.sendAllExceptOrigin(data, ws)
    });

    // Show client is connected
    console.log("Client ready to accept commands.")
    clientList[ws.id] = true;
    wss.sendAll({ type: "MSSG", data : clientList});
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}