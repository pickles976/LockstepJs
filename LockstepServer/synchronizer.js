class Synchronizer {

    constructor() {
        this.clients = []
        this.clientLatencies = {}
        this.clientOffsets = {}
        this.clientTimes = {}
    }

    addClient(ws) {
        this.clients.push(ws)
        this.clientLatencies[ws.id] = []
        this.clientOffsets[ws.id] = []
    }

    timeRequest(ws) {
        // Store the current time and send a time TREQ packet to the client
    }

    timeResponse(ws) {
        // Process a TRES packet and find the latency and offset

    }

    startClientTimer() {
        // Tell the client to start its timer
    }

    handleClientTimerSuccess() {
        
    }



}