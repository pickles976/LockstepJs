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

wss.on('connection', function connection(ws) {

  ws.id = wss.getUniqueID();

  ws.on('error', console.error);

  ws.on('close', function close() {
    delete clientList[ws.id];
  })

  synchronize(ws)

//   clientList[ws.id] = true;
//   wss.sendAll({ type: "MSSG", data : clientList});

//   wss.sendAll({ type: "TREQ", data : {}});

//   ws.send('Connected');


});

// TODO: we need to do this multiple times, over the course of a few seconds
// then average them to get our sync values
function synchronize(ws) {

    console.log(`Synchronizing client clock ${ws.id}`)
    let latencies = []
    let offsets = []
    let i = 0

    ws.on('message', function message(data) {

        // console.log(time_0)
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
            readyClient(ws)
        }
    });

    time_0 = Date.now()
    ws.send(JSON.stringify({ type: "TREQ", data : {}}), {binary: false})
}

function readyClient(ws) {
    // TODO: listen for success message
    // if message successful, just start forwarding commands to everyone
    ws.send(JSON.stringify({ type: "STRT", data : { latency: ws.latency, offset: ws.clock_diff, epoch: epoch_time }}), {binary: false})
    console.log("Send client sync packet")
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}