const NUM_HANDSHAKES = 5;

/**
 * 1. Handshake - find client latency and timer offset
 * 2. Synchronize - synchronize client clock to server time
 * 3. Ready - forward all incoming commands to every other client
 * 
 * - Client connects to server
 * - Server sends a TREQ packet to the client, and logs the current time
 * - Client sends a TRES packet to the server, server logs time recieved
 * - Server uses the three timestamps to calculate the latency and offset between the client and server clocks
 * - Server sends TREQ packets and reads TRES packets a few more times
 * - Server averages latency/offset values
 * - Server sends a STRT packet to the client, telling it to start its turn timer with the server epoch as the start point
 * - Client starts turn loop and sends a SUCC packet back to the server
 * - Server notifies all other clients
 */
export class Synchronizer {

    constructor() {
        this.clients = {}
        this.clientLatencies = {}
        this.clientOffsets = {}
        this.clientTimes = {}
        this.clientHandshakes = {}
        this.epoch_time = Date.now()
    }

    addClient(ws) {
        this.clients[ws.id] = false
        this.clientLatencies[ws.id] = []
        this.clientOffsets[ws.id] = []
        this.clientTimes[ws.id] = { time_0: 0, time_1: 0, time_2: 0};
        this.clientHandshakes[ws.id] = 0
    }

    timeRequest(ws) {
        // Store the current time and send a time TREQ packet to the client
        this.clientTimes[ws.id].time_0 = Date.now()
        ws.send(JSON.stringify({ type: "TREQ", data : {}}), {binary: false})
    }

    timeResponse(ws, packet) {

        // console.log(packet)

        // Process a TRES packet and find the latency and offset
        this.clientTimes[ws.id].time_1 = packet.data.time
        this.clientTimes[ws.id].time_2 = Date.now()

        let latency = (this.clientTimes[ws.id].time_2 - this.clientTimes[ws.id].time_0) / 2
        let clock_diff =  (this.clientTimes[ws.id].time_2 - latency) - this.clientTimes[ws.id].time_1
    
        this.clientLatencies[ws.id].push(latency)
        this.clientOffsets[ws.id].push(clock_diff)

        this.clientHandshakes[ws.id]++;
        
    }

    startClientTimer(ws) {

        // Tell the client to start its timer
        const mean_latency = this.clientLatencies[ws.id].reduce(function (acc, curr){
            return acc + curr;
          }, 0) / this.clientLatencies[ws.id].length;
        const mean_diff =  this.clientOffsets[ws.id].reduce(function (acc, curr){
            return acc + curr;
          }, 0) / this.clientOffsets[ws.id].length;
        ws.latency = mean_latency
        ws.clock_diff = mean_diff

        // Tell client to start game timer
        ws.send(JSON.stringify({ type: "STRT", data : { latency: ws.latency, offset: ws.clock_diff, epoch: this.epoch_time }}), {binary: false})
        console.log("Sending client sync packet")
    }

    handleClientTimerSuccess(ws) {
        console.log(`Client ${ws.id} has been synced!`)
        this.clients[ws.id] = true
    }

    handshakeFinished(ws) {
        return this.clientHandshakes[ws.id] > NUM_HANDSHAKES;
    }

}